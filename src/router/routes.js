import Vue from 'vue'
let files = require.context('../pages', true, /\.vue$/) // 根据目录结构去搜索文件
let filesKey = files.keys() // 获取整个目录结构
console.log(filesKey)
/**
 * 获取路由name
 * @param {*} file type：string （文件完整的目录）
 */
const getRouteItemName = (file) => {
  let match = file.match(/\/(.+?)\.vue$/)[1] // 去除相对路径与.vue
  let res = match.replace(/_/ig, '').replace(/\//ig, '-') // 把下划线去除， 改变/为-拼接
  return res
}

/**
 * 获取路由path
 * @param {*} file String （目录，一级路由则为完整目录，多级为自身目录名称）
 */
const getRouteItemPath = (file) => {
  return file.replace('/index.vue', '').replace('index.vue', '').replace('vue', '').replace(/_/g, ':').replace(/\./g, '')
}

/**
 * 注册组建
 * @param {*} componentConfig （即为调用files方法得出的componentConfig）
 */
const registerComponent = (componentConfig) => Vue.component(componentConfig.default.name || componentConfig.default, componentConfig.default || componentConfig)

/**
 * 校验目录下是否有其他文件,注意((?!${name}).)是因为要查询的目录有可能为name/name.vue，而这样可能会导致误判有无children，所以要匹配非name。
 * @param {*} file type：string （当前目录路径）
 * @param {*} name type：string （目录的文件名 默认等于file参数）
 */
const hasfile = (file, name = file) => new RegExp(file + `/((?!${name}).)`)

/**
 * 校验.vue文件
 * @param {*} file type：string （当前目录路径）
 */
const hasVue = (file) => new RegExp(file + '.vue')

/**
 * 构建路由
 * @param {*} map type：Object
 */
const getRoutes = (map) => {
  let res = []
  for (let key in map) { // 遍历对象
    let level = map[key] // 取出对应value
    let text = level.join('@') // 用@把分级数组拼接，这样只是为了方便查找
    let expr1 = hasfile(key) // 校验规则，有无子文件
    let expr2 = hasVue(key) // 校验规则，有无vue文件
    let route = {} // 初始化route
    if (text.match(expr1) && text.match(expr2)) { // 有children的route
      let max = Math.max(...level.map(v => v.match(/\/(.+?).vue$/)[1].split('/').length)) // 找目录里最深的层级数
      let i = 0 // 标记层级
      while (i++ < max) { // 按层级来搭建route
        level.forEach((item) => {
          let wipeOfVue = item.match(/\/(.+?).vue$/)[1] // 匹配纯路径,去除相对路径与.vue
          let classArray = wipeOfVue.split('/') // 切割为了方便操作
          let len = classArray.length // 深度
          if (len === i) {
            if (i === 1) { // 如果为第一层，则必带有children
              route = {
                component: registerComponent(files(item)),
                path: getRouteItemPath(item),
                children: []
              }
            } else {
              let file = item.match(/(.+?)\.vue$/)[1] // 只匹配目录下.vue之前的路径
              let name = classArray[len - 1] // 获取每个路径下具体的文件名
              let iteration = classArray.slice(0, len - 1) // 截取文件路径
              let childRoute = {
                component: registerComponent(files(item)),
                path: getRouteItemPath(name)
              }
              // 从文件的目录下搜索有无子文件，有子文件代表有children属性。 否则无，则直接给route增加name属性
              text.match(hasfile(file, name)) && text.match(hasVue(file)) ? childRoute.children = [] : childRoute.name = getRouteItemName(item)

              // 通过截取的目录找到对应的parent
              let parent = iteration.reduce((map, current, index) => {
                let path = index === 0 ? getRouteItemPath(`/${current}.vue`) : getRouteItemPath(`${current}.vue`)
                return map.filter(v => v.path === path)[0].children
              }, [route])
              parent && parent.push(childRoute)
            }
          }
        })
      }
      res.push(route) // 添加route对象
    } else { // 没有children，直接遍历插入
      level.forEach(item => {
        route = {
          component: registerComponent(files(item)),
          name: getRouteItemName(item),
          path: getRouteItemPath(item)
        }
        res.push(route) // 添加route对象
      })
    }
  }
  return res // 返回整个route对象
}

/**
 * 以一级文件或者文件夹 分类获取路由
 */
const createClassify = () => {
  let map = filesKey.reduce((map, cur) => {
    let dislodge = cur.match(/\/(.+?)\.vue$/)[1] // 只匹配纯文件名的字符串
    let key = dislodge.split('/')[0] // 拿到一级文件的名称
    if (!map[key]) {
      map[key] = []
    }
    map[key].push(cur)
    return map
  }, {})
  return getRoutes(map)
}

const freeRoute = createClassify()
console.log(freeRoute)
const routes = [
  ...freeRoute
]

export default routes
