import { FishingQuota, DataManagement, Main } from '@daml.js/odyssey';
import { useLedger, useParty, useQuery } from '@daml/react';
import React, { useState, useEffect } from 'react';
import * as ui from 'semantic-ui-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { ReportView, ReportModel, ReportViewModel } from './ReportView';
import { ReportForm } from './ReportForm';
import { ContractId } from '@daml/types';
import { PublicationModel, PublicationView } from './PublicationView';
import { Tab } from 'semantic-ui-react';
import { QuotaView, QuotaRequestModel, QuotaModel } from './QuotaView';

const MainView: React.FC = () => {

    const username = useParty();

    const ledger = useLedger();

    let [reports, setReports] = useState<ReportViewModel[]>([]);

    let [publications, setPublications] = useState<PublicationModel[]>([]);

    let [quotaRequests, setQuotaRequsts] = useState<QuotaRequestModel[]>([]);

    let [quotas, setQuotas] = useState<QuotaModel[]>([]);

    let reportQ = useQuery(DataManagement.Report.Report)
    let pubQ = useQuery(DataManagement.Report.Publication)
    let quotaRequestQ = useQuery(FishingQuota.FishingQuota.FishingQuotaRequest);
    let quotaQ = useQuery(FishingQuota.FishingQuota.FishingQuota)

    useEffect(() => {
        setReports(reportQ.contracts.map(x => reportModelFromReport(x.contractId, x.payload)));
        setPublications(pubQ.contracts.map(x => publicationModelFromContract(x.contractId, x.payload)));
        setQuotaRequsts(quotaRequestQ.contracts.map(x => quotaRequestModelFromContract(x.contractId, x.payload)));
        setQuotas(quotaQ.contracts.map(x => quotaModelFromContract(x.contractId, x.payload)));
    }, [ledger, reportQ, pubQ, quotaRequestQ, quotaQ])

    let createReport = function (r: ReportModel) {
        try {
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
            }).catch(e => console.log(`error report create ${e}`));
        } catch {
            console.log("error report create");
        }
    }

    let check = function (contractId: ContractId<DataManagement.Report.Report>) {
        try {
            ledger.exercise(DataManagement.Report.Report.Check, contractId, {})
                .catch(e => console.log(`error: reject: ${e} `));
        } catch {
            console.log("error: check")
        }
    }

    let reject = function (contractId: ContractId<DataManagement.Report.Report>) {
        try {
            ledger.exercise(DataManagement.Report.Report.Reject, contractId, {})
                .catch(e => console.log(`error: reject: ${e} `));
        } catch {
            console.log("error: reject");
        }
    }

    let requestQuota = function (contractId: ContractId<DataManagement.Report.Publication>) {
        try {
            ledger.exercise(DataManagement.Report.Publication.RequestQuota, contractId, { requestor: username })
                .catch(e => console.log(`error: request: ${e}`));
        } catch {
            console.log("error: quota request");
        }
    }

    let issueQuota = function (contractId: ContractId<FishingQuota.FishingQuota.FishingQuotaRequest>) {
        if (username == "Commission") {
            ledger.exercise(FishingQuota.FishingQuota.FishingQuotaRequest.Issue, contractId, {})
                .catch(e => console.log(`error quota issue: ${e}`));
        } else {

        }
    }

    var view = <ui.Container />
    if (username == "Commission") {
        view = <ReportView reports={reports} check={check} reject={reject}> </ReportView>;
    }
    else {
        view = <ReportForm submit={createReport} reporter={username} > </ReportForm>;
    }

    const mapView = (
        <MapContainer id="mapid" center={[32.3104298, -64.7954125]} zoom={5} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {reports
                .map(rvm => rvm.report)
                .map(rs => { return { p: ([rs.areaCenterLat, rs.areaCenterLong] as LatLngExpression), r: rs } })
                .map(({ p, r }) => {
                    return (
                        <Marker position={p}>
                            <Popup>
                                {r.fish} fishing activity from {r.reporter}:
                                    <span>qty: {r.caughtQty}</span>
                            </Popup>
                        </Marker>)
                })}
        </MapContainer>);

    const panes = [
        { menuItem: 'Map View', pane: (<Tab.Pane key="map"><div>{mapView}</div></Tab.Pane>) },
        { menuItem: 'Reports', pane: <Tab.Pane key="report"><div>{view}</div></Tab.Pane> },
        {
            menuItem: 'Publications', pane: <Tab.Pane key="pub"><div>
                {publications.map(p => <PublicationView publication={p} username={username} request={requestQuota} />)}
            </div>
            </Tab.Pane>
        },
        { menuItem: 'Quotas', pane: <Tab.Pane key="q"><div><QuotaView quotas={quotas} requests={quotaRequests} username={username} issue={issueQuota} /></div></Tab.Pane> },
    ]

    return (
        <ui.Container>
            <Tab panes={panes} renderActiveOnly={false} />
        </ui.Container>);
}

let quotaRequestModelFromContract = function (
    contractId: ContractId<FishingQuota.FishingQuota.FishingQuotaRequest>,
    req: FishingQuota.FishingQuota.FishingQuotaRequest
): QuotaRequestModel {
    return {
        fish: req.species,
        requestor: req.requestor,
        contractId: contractId
    };
}

let quotaModelFromContract = function (
    contractId: ContractId<FishingQuota.FishingQuota.FishingQuota>,
    q: FishingQuota.FishingQuota.FishingQuota
): QuotaModel {
    return {
        qty: Number.parseFloat(q.quantity),
        fish: q.species,
        owner: q.owner,
        issuer: q.issuer,
    };
}

let reportModelFromReport = function (
    contractId: ContractId<DataManagement.Report.Report>,
    r: DataManagement.Report.Report): ReportViewModel {
    return {
        report: {
            reporter: r.reporter,
            caughtQty: Number.parseFloat(r.content.caughtQty),
            areaCenterLong: Number.parseFloat(r.content.area._1.long),
            areaCenterLat: Number.parseFloat(r.content.area._1.lat),
            areaRadius: Number.parseFloat(r.content.area._2),
            fish: r.content.species,
        },
        contractId: contractId
    };
};

let publicationModelFromContract = function (
    contractId: ContractId<DataManagement.Report.Publication>,
    p: DataManagement.Report.Publication): PublicationModel {
    return {
        fish: p.content.species,
        allowed: Number.parseFloat(p.content.totalAllowance),
        timeLimit: p.content.timeLimit,
        areaCenterLat: Number.parseFloat(p.content.targetArea._1.lat),
        areaCenterLong: Number.parseFloat(p.content.targetArea._1.long),
        areaRadius: Number.parseFloat(p.content.targetArea._2),
        contractId: contractId
    };
}




export default MainView;
