
import { Main, DataManagement } from '@daml.js/odyssey';
import { useLedger, useParty } from '@daml/react';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import * as ui from 'semantic-ui-react';
import MapView from './MapView';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { ContractId } from '@daml/types';

export type ReportModel = {
    reporter: string
    caughtQty: number
    areaCenterLong: number
    areaCenterLat: number
    areaRadius: number
    fish: string
} 



type Props = { reports: ReportModel[]}

export const ReportView: React.FC<Props> = ({reports}) => {
    
    return (
        <ui.Container>
            <ui.CardGroup>
            {reports.map(r => {
            return (<ui.Card>
                <ui.CardContent>
                    <ui.CardHeader>
                        {r.reporter}: ({r.areaCenterLat}, {r.areaCenterLong})
                    </ui.CardHeader>
                </ui.CardContent>
                <ui.CardContent>
                    <ui.Feed>
                        <ui.FeedEvent>
                            <ui.FeedLabel>
                                {r.fish}
                            </ui.FeedLabel>
                            <ui.FeedContent>
                                <ui.FeedSummary>
                                    Qty: {r.caughtQty}
                                </ui.FeedSummary>
                            </ui.FeedContent>
                        </ui.FeedEvent>
                    </ui.Feed>
                </ui.CardContent>
                <ui.CardContent extra>
                    <div className="ui two buttons">
                    <ui.Button basic color="green">Check</ui.Button>
                    <ui.Button basic color="red">Reject</ui.Button>
                    </div>
                </ui.CardContent>
            </ui.Card>);
            })}
            </ui.CardGroup>
        </ui.Container>
    )
}
