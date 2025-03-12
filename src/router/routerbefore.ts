function setRouterBefore(rourter: any) {
  rourter.beforeEach((to: any, _: any, next: any) => {
    document.title = <string | undefined | null>to.meta?.title ?? '未知页面'
    next()
  })
}

export default setRouterBefore
