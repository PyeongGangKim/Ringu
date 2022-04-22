import React, { useState, useEffect } from 'react';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

import { BarChart, Area, Cell, Bar, Pie, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

function PaymentChartAll(year, author_id) {
    const [data, setData ] = useState([]);

    useEffect(() => {
        console.log(33333333333333)
        update();
    }, []);

    const update = async() => {
        try {
            console.log(333)
            var params = {
                author_id: author_id,
                year: year
            }
            const salesRes = await API.sendGet(URL.api.purchase.sales, params)
            if(salesRes.status === 200) {
                var sales = salesRes.data.sales;
                var d = []
    
                for(var i = 0; i < 12; i++) {
                    d.push({
                        y: year,
                        m: i+1,
                        revenue: 0,
                        count: 0})
                }
    
                for(var i = 0; i < sales.length; i++) {
                    var m = sales[i].m;
                    d[m-1] = sales[i];
                }
                setData(d);            
            } else if(salesRes.status === 204) {
                d = [];
                setData(d);
            }
        } catch(e) {
            console.error(e)
        }

    }    

    return (
        <ResponsiveContainer
            width="100%"
            height="100%"
        >
            <BarChart data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}>
                <XAxis dataKey="m"/>
                <YAxis dataKey="revenue" />
                <Tooltip/>
                <Bar dataKey='revenue' fill='#5c4ce5'/>
            </BarChart>
        </ResponsiveContainer>
    )        
}

export default PaymentChartAll