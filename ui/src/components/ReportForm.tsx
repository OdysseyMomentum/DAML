import { Main } from '@daml.js/odyssey';
import { useLedger, useParty } from '@daml/react';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import * as ui from 'semantic-ui-react';
import MapView from './MapView';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { ReportModel } from './ReportView'
import { Button } from 'semantic-ui-react';

type Props = { 
    submit: (data: ReportModel) => void 
    reporter: string
   }

export const ReportForm : React.FC<Props> = ({submit, reporter}) => {
    let empty : ReportModel = {
        reporter: reporter,
        caughtQty: 0,
        areaCenterLong: 0,
        areaCenterLat: 0,
        areaRadius: 0,
        fish: ""
    };

   const [model, setModel] = useState<ReportModel>(empty)

   return (
   <ui.Form onSubmit={() => submit(model) }>
       <ui.Form.Field> <ui.Label>Qty</ui.Label><ui.Input value={model.caughtQty} type="number" onChange={(_,v) =>  {
           let m = model;
           m.caughtQty = Number.parseInt(v.value);
           setModel(m)
        }} ></ui.Input>
        </ui.Form.Field>
       <ui.Form.Field><ui.Label>Area center Longitude</ui.Label><ui.Input type="text" onChange={(_,v) =>  {
           let m = model;
           m.areaCenterLong = Number.parseInt(v.value);
           setModel(m)
        }} ></ui.Input></ui.Form.Field>
       <ui.Form.Field><ui.Label>Area center Latitude</ui.Label><ui.Input type="text" onChange={(_,v) =>  {
           let m = model;
           m.areaCenterLat = Number.parseInt(v.value);
           setModel(m)
        }} ></ui.Input></ui.Form.Field>
       <ui.Form.Field><ui.Label>Area radius</ui.Label><ui.Input type="text" onChange={(_,v) =>  {
           let m = model;
           m.areaRadius = Number.parseInt(v.value);
           setModel(m)
        }} ></ui.Input></ui.Form.Field>
       <ui.Form.Field><ui.Label>Fish species</ui.Label><ui.Input type="text" onChange={(_,v) =>  {
           let m = model;
           m.fish = v.value;
           setModel(m)
        }} ></ui.Input></ui.Form.Field>
       <ui.Form.Field><Button type="submit">Submit Report</Button></ui.Form.Field>
   </ui.Form>
   );
};