
import { DataManagement } from '@daml.js/odyssey';
import React from 'react';
import * as ui from 'semantic-ui-react';
import { ContractId } from '@daml/types';

export type ReportModel = {
    reporter: string
    caughtQty: number
    areaCenterLong: number
    areaCenterLat: number
    areaRadius: number
    fish: string
}

export type ReportViewModel = {
    report: ReportModel
    contractId: ContractId<DataManagement.Report.Report>
}

type Props = {
    reports: ReportViewModel[]
    check: (cid: ContractId<DataManagement.Report.Report>) => void
    reject: (cid: ContractId<DataManagement.Report.Report>) => void
}

export const ReportView: React.FC<Props> = ({ reports, check, reject }) => {

    return (
        <ui.Container>
            <ui.CardGroup>
                {reports.map(r => {
                    return (<ui.Card>
                        <ui.CardContent>
                            <ui.CardHeader>
                                {r.report.reporter}: ({r.report.areaCenterLat}, {r.report.areaCenterLong})
                    </ui.CardHeader>
                        </ui.CardContent>
                        <ui.CardContent>
                            <ui.Feed>
                                <ui.FeedEvent>
                                    <ui.FeedLabel>
                                        {r.report.fish}
                                    </ui.FeedLabel>
                                    <ui.FeedContent>
                                        <ui.FeedSummary>
                                            Qty: {r.report.caughtQty}
                                        </ui.FeedSummary>
                                    </ui.FeedContent>
                                </ui.FeedEvent>
                            </ui.Feed>
                        </ui.CardContent>
                        <ui.CardContent extra>
                            <div className="ui two buttons">
                                <ui.Button basic color="green" onClick={() => check(r.contractId)}>Check</ui.Button>
                                <ui.Button basic color="red" onClick={() => reject(r.contractId)}>Reject</ui.Button>
                            </div>
                        </ui.CardContent>
                    </ui.Card>);
                })}
            </ui.CardGroup>
        </ui.Container>
    )
}
