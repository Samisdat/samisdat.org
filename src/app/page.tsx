'use client';

import { Panorama } from '@/components/Panorama';
import { TalProvider } from '@/lib/TalContext';
import styles from './page.module.css';

export default function Home() {
    return (
        <TalProvider>
            <div className={styles.page}>
                <main className={styles.main}>
                    <Panorama />
                </main>
            </div>
        </TalProvider>
    );
}
