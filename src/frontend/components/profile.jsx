import React, { useCallback, useState } from 'react';
import { useStream } from 'react-fetch-streams';

const Profile = () => {
    const [data, setData] = useState(null);
    const onNext = useCallback(async res => {
        const data = await res.json();
        setData(data);
    }, [setData]);
    useStream(`${window.location.origin}/cpu-stream`, { onNext });

    return (
        <React.Fragment>
            {data ? <p>{`CPU usage : ${Number.parseFloat(data.cpu).toFixed(2)}%`}<br />
                {`Memory usage : ${Math.round(Number.parseFloat(data.memory).toFixed(2))}%`}<br />
                {data.fps ? `FPS : ${Math.round(Number.parseFloat(data.fps).toFixed(2))}` : null}
            </p> : null}
        </React.Fragment>
    )
}

export default Profile
