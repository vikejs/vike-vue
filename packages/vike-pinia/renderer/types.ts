export type { PiniaAdditionalSSRContext }

import type { StateTree } from 'pinia';

type PiniaAdditionalSSRContext = {
  piniaInitialState?: StateTree;
}
