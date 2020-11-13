import { DataManagement, Main } from '@daml.js/odyssey';
import { useLedger, useParty } from '@daml/react';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import * as ui from 'semantic-ui-react';
import MapView from './MapView';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { ReportView, ReportModel } from './ReportView';
import { ReportForm } from './ReportForm';
import { formatDiagnosticsWithColorAndContext } from 'typescript';

const MainView: React.FC = () => {

    const username = useParty();
    const position: LatLngExpression = [32.3104298, -64.7954125]

    const ledger = useLedger();

    let [reports, setReports] = useState<ReportModel[]>([])

    let reportModelFromReport = function (r: DataManagement.Report.Report): ReportModel {
        return {
            reporter: r.reporter,
            caughtQty: Number.parseFloat(r.content.caughtQty),
            areaCenterLong: Number.parseFloat(r.content.area._1.long),
            areaCenterLat: Number.parseFloat(r.content.area._1.lat),
            areaRadius: Number.parseFloat(r.content.area._2),
            fish: r.content.species,
        }
    };


    let reportsQ = ledger.query(DataManagement.Report.Report)
        .then(xs => xs.map(x => reportModelFromReport(x.payload)))
        .then(setReports)

    let createReport = function (r: ReportModel) {
        ledger.fetchByKey(Main.User, username).then(user => {
            if (user) {
                ledger.exercise(Main.User.SubmitReport, user.contractId,
                    {
                        content: {
                            species: r.fish,
                            caughtQty: r.caughtQty.toFixed(),
                            timestamp: (new Date()).toISOString(),
                            area: {
                                _1: {
                                    long: r.areaCenterLong.toFixed(),
                                    lat: r.areaCenterLat.toFixed()
                                },
                                _2: r.areaRadius.toFixed()
                            },
                            duration: { microseconds: "0" }
                        }
                    })
            }
        });
    }
    var view = <ui.Container />
    if (username == "Commission") {
        view = <ReportView reports={reports}> </ReportView>;
    }
    else {
        view = <ReportForm submit={createReport} reporter={username} > </ReportForm>;
    }

    return (
        <ui.Container>
            <MapContainer id="mapid" center={[32.3104298, -64.7954125]} zoom={5} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {reports
                    .map(rs => { return {p : ([rs.areaCenterLat, rs.areaCenterLong] as LatLngExpression), r: rs }})
                    .map(({p, r}) => {
                        return (
                            <Marker position={p}>
                                <Popup>
                                    {r.fish} fishing activity from {r.reporter}:
                                    <span>qty: {r.caughtQty }</span>
                                </Popup>
                            </Marker>)
                    })}
            </MapContainer>
            {view}
        </ui.Container>);
}

export default MainView;
