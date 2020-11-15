
import { Main, DataManagement } from '@daml.js/odyssey';
import { useLedger, useParty } from '@daml/react';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import * as ui from 'semantic-ui-react';
import MapView from './MapView';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { ContractId } from '@daml/types';

export type PublicationModel = {
    fish: string
    timeLimit: string,
    allowed: number
    areaCenterLong: number
    areaCenterLat: number
    areaRadius: number
    contractId: ContractId<DataManagement.Report.Publication>
} 

type Props = { publication: PublicationModel
               username: string
               request: (contractId: ContractId<DataManagement.Report.Publication>) => void
             }

export const PublicationView: React.FC<Props> = ({publication, username, request}) => {
    
    let buttons = (<ui.Button basic color="green" onClick={() => request(publication.contractId)}>Request Quota</ui.Button>);
    if(username == "Commission") {
        buttons = (<></>);
    }
    return (
            <ui.Card>
                <ui.CardContent>
                    <ui.CardHeader>
                        {publication.fish}: ({publication.areaCenterLat}, {publication.areaCenterLong})
                    </ui.CardHeader>
                </ui.CardContent>
                <ui.CardContent>
                    <ui.Feed>
                        <ui.FeedEvent>
                            <ui.FeedLabel>
                                {publication.fish}
                            </ui.FeedLabel>
                            <ui.FeedContent>
                                <ui.FeedSummary>
                                    Total Allowance: {publication.allowed}
                                </ui.FeedSummary>
                            </ui.FeedContent>
                        </ui.FeedEvent>
                    </ui.Feed>
                </ui.CardContent>
                <ui.CardContent extra>
                    <div>{buttons}</div>
                </ui.CardContent>
            </ui.Card>);
    
}
