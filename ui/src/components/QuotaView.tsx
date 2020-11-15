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
    deny: (contactId: ContractId<FishingQuotaRequest>) => void
}

export const QuotaView: React.FC<Props> = ({ quotas, requests, username, issue, deny }) => {

    var extra = (contractId: ContractId<FishingQuotaRequest>) => {return (<ui.CardContent extra></ui.CardContent>) }
    if (username == "Commission") {
        extra = (contractId: ContractId<FishingQuotaRequest>) => {return (<ui.CardContent extra>
            <div className="ui two buttons">
                <ui.Button basic color="green" onClick={() => issue(contractId)}>Issue</ui.Button>
                <ui.Button basic color="red" onClick={() => deny(contractId)}>Deny</ui.Button>
            </div>
        </ui.CardContent>); }
    } 

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
                                    {extra(r.contractId)}
                                </ui.Card>
                            </ui.Segment>)
                    })}
                </ui.GridColumn>
            </ui.Grid>
        </ui.Container>
    );
}
