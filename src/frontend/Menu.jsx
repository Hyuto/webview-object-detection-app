import React, { useCallback, useState } from 'react';
import { useStream } from 'react-fetch-streams';
import * as style from "./style/Menu.module.scss"

const Menu = () => {
    const [data, setData] = useState(null);
    const onNext = useCallback(async res => {
        const data = await res.json();
        setData(data);
    }, [setData]);
    useStream(`${window.location.origin}/cpu-profiler`, { onNext });

    return (
        <div className={style.Menu}>
            {data ? <p>{`CPU usage : ${Number.parseFloat(data.cpu).toFixed(2)}%`}<br />
                {`Memory usage : ${Math.round(Number.parseFloat(data.memory).toFixed(2))}%`}<br />
                {data.fps ? `FPS : ${Math.round(Number.parseFloat(data.fps).toFixed(2))}` : null}
            </p> : null}
        </div>
    )
}

export default Menu
