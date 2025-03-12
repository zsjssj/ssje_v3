import router from './index.ts'

router.beforeEach(async (to, _, next) => {
  document.title = <string | undefined | null>to?.meta?.title ?? '未知页面'
  next()
})
