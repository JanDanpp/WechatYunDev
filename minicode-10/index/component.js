import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from './store'

Component({
  options: {
    styleIsolation: 'shared'
  },
  behaviors: [storeBindingsBehavior],
  data: {
    someData: '...'
  },
  storeBindings: {
    store,
    fields: {
      numA: () => store.numA,
      numB: (store) => store.numB,
      sum: 'sum'
    },
    actions: {
      buttonTap: 'update'
    },
  }
})
