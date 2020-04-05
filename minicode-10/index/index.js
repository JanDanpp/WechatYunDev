import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from './store'

Page({
  data: {
    someData: '...'
  },
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['numA', 'numB', 'sum'],
      actions: ['update'],
    })
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings()
  }
})
