import { defineScript } from '../script';
import { segment } from './segment';

import type { Device, Script } from '../script';
import type { RecordedEvent, RecordOptions } from './types';

/** One recording session to a script in the existing format. */
export const recordScript = (events: readonly RecordedEvent[], device: Device, options: RecordOptions = {}): Script =>
    defineScript(device, segment(events, device, options));
