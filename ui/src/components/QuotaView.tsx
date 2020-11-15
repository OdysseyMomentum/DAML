import React from 'react';
import * as ui from 'semantic-ui-react';
import { ContractId } from '@daml/types';
import { FishingQuotaRequest } from '@daml.js/odyssey/lib/FishingQuota/FishingQuota';

export type QuotaRequestModel = {
    fish: string
    requestor: string
    contractId: ContractId<FishingQuotaRequest>
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
