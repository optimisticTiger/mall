import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  addCart(context, payload) {
    // let oldProduct = null;
    // for(let item of state.cartList){
    //   if(item.iid === payload.iid) {
    //     oldProduct = item;
    //   }
    // }
    let oldProduct = {
      count: 1
      // bool: null
    }
    context.state.cartList.find(item => item.iid === payload.iid)
    if(context.state.cartList.find(item => item.iid === payload.iid)) {
      // oldProduct.count += 1
      context.commit(ADD_COUNTER,oldProduct)
    }else {
      oldProduct.count = 1
      // context.state.cartList.push(payload)
      context.commit(ADD_TO_CART,payload)
    }
  }
}