import { Data, DataManagement, Main } from '@daml.js/odyssey';
import { useLedger, useParty } from '@daml/react';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import * as ui from 'semantic-ui-react';
import MapView from './MapView';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { ReportView, ReportModel, ReportViewModel } from './ReportView';
import { ReportForm } from './ReportForm';
import { formatDiagnosticsWithColorAndContext } from 'typescript';
import { ContractId } from '@daml/types';
import { Report } from '@daml.js/odyssey/lib/DataManagement/Report';
import { PublicationModel, PublicationView } from './PublicationView';
import { FishingQuotaRequest, Issue } from '@daml.js/odyssey/lib/FishingQuota/FishingQuota';

export type QuotaRequestModel = {
    // qty: number
    fish: string
    requestor: string
    contractId: ContractId<FishingQuotaRequest>
    // areaLat: number
    // areaLong: number
}

export type QuotaModel = {
    qty: number
    fish: string
    issuer: string
    owner: string
};

type Props = {
    quotas: QuotaModel[]
    requests: QuotaRequestModel[]
    username: string
    issue: (contactId: ContractId<FishingQuotaRequest>) => void
}
export const QuotaView: React.FC<Props> = ({ quotas, requests, username, issue }) => {
    if (username == "Commission") {
        return (
            <ui.Container>
                <ui.Grid columns={2}>
                    <ui.GridColumn>
                        {quotas.map(q => {
                            return (<ui.Segment>
                                <ui.Card>
                                    <ui.CardContent>
                                        <ui.CardHeader>
                                            Issued to: {q.owner}
                                        </ui.CardHeader>
                                    </ui.CardContent>
                                    <ui.CardContent>
                                        {q.fish}: {q.qty}
                                    </ui.CardContent>
                                </ui.Card>
                            </ui.Segment>)
                        })}
                    </ui.GridColumn>
                    <ui.GridColumn>
                        {requests.map(r => {
                            return (
                                <ui.Segment>
                                    <ui.Card>
                                        <ui.CardContent>
                                            <ui.CardHeader>
                                                Requested: {r.requestor}
                                            </ui.CardHeader>
                                        </ui.CardContent>
                                        <ui.CardContent>
                                            {r.fish}
                                        </ui.CardContent>
                                        <ui.CardContent extra>
                                            <div>
                                                <ui.Button basic color="green" onClick={() => issue(r.contractId)}>Issue</ui.Button>
                                            </div>
                                        </ui.CardContent>
                                    </ui.Card>
                                </ui.Segment>
                            )
                        })}
                    </ui.GridColumn>
                </ui.Grid>
            </ui.Container>
        );
    } else {
        return (
            <ui.Container>
                <ui.Grid columns={2}>
                    <ui.GridColumn>
                        {quotas.map(q => {
                            return (<ui.Segment>
                                <ui.Card>
                                    <ui.CardContent>
                                        <ui.CardHeader>
                                            Issued to: {q.owner}
                                        </ui.CardHeader>
                                    </ui.CardContent>
                                    <ui.CardContent>
                                        {q.fish}: {q.qty}
                                    </ui.CardContent>
                                </ui.Card>
                            </ui.Segment>)
                        })}
                    </ui.GridColumn>
                    <ui.GridColumn>
                        {requests.map(r => {
                            return (
                                <ui.Segment>
                                    <ui.Card>
                                        <ui.CardContent>
                                            <ui.CardHeader>
                                                Requested: {r.requestor}
                                            </ui.CardHeader>
                                        </ui.CardContent>
                                        <ui.CardContent>
                                            {r.fish}
                                        </ui.CardContent>
                                    </ui.Card>
                                </ui.Segment>
                            )
                        })}
                    </ui.GridColumn>
                </ui.Grid>
            </ui.Container>)

    }
}
