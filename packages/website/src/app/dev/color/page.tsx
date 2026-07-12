import { notFound } from 'next/navigation';

import { Heading } from '@samisdat/ui-components/Heading';

export default async function Home() {
    if (process.env.NODE_ENV === 'production') {
        return notFound();
    }
    return (
        <>
            <Heading>Color</Heading>
            <div className="color background-color"></div>
            <div className="color foreground-color"></div>
            <div className="color red"></div>
            <div className="color orange"></div>
            <div className="color yellow"></div>
            <div className="color green"></div>
            <div className="color teal"></div>
            <div className="color blue"></div>
            <div className="color purple"></div>
            <div className="color pink"></div>
        </>
    );
}
