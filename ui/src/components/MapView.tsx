import * as odyssey from '@daml.js/odyssey';
import { useLedger, useParty, useStreamQuery } from '@daml/react';
import { ContractId } from '@daml/types';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import * as ui from 'semantic-ui-react';
import * as d3 from 'd3'

type Ship = {
    long: number
    lat: number
    dir: string
};

const MapView: React.FC = () => {
    const ledger = useLedger();
    let height = 800;
    let width = 800;

    const svgRef = useRef(null);
    const [data, setData] = useState([] as Ship[]);

    let ships = ledger.query(odyssey.VesselTracking.ShipTrajectory.ShipTrajectory)
        .then(xs => xs.map(x => x.payload))
        .then(xs => xs.map(shipFromTrajectory))
        .then(setData);

    let shipFromTrajectory = function (st: odyssey.VesselTracking.ShipTrajectory.ShipTrajectory): Ship {
        return {
            long:Number.parseFloat(st.lastKnownPosition.long),
            lat: Number.parseFloat(st.lastKnownPosition.lat),
            dir: st.heading
        };
    };

    useEffect(() => {
        if (svgRef.current) {
            const root = d3.select(svgRef.current);
            let dt = data.map(x => x.lat);
            console.log(dt);
            root
                .append('g')
                .selectAll('circle')
                .data(dt)
                .enter()
                .append('circle')
                .attr('cx', (d, i) => 10 + i * 20)
                .attr('cy', (d, i) => 100)
                .attr('stroke', 'blue')
                .attr('fill', 'none')
                .attr('r', (d, i) => d);
        }
    }, [svgRef.current, data]);

    return (
        <svg ref={svgRef} width={width} height={height} />
    );
}

export default MapView;
