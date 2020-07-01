// init.js
const inquirer = require('inquirer')
const chalk = require('chalk')
const { exec } = require('child_process')
chalk.level = 3 // 设置chalk等级为3
const fs = require('fs')
const ora = require('ora')

module.exports = () => {
  console.log(chalk.green('初始化项目'))
  inquirer.prompt([{
    type: 'input', // 问题类型为填空题
    message: '项目名称:', // 问题描述
    name: 'projectName', // 问题对应的属性
    validate: (val) => { // 对输入的值做判断
      if (val === "") {
        return chalk.red('项目名不能为空，请重新输入')
      }
      return true
    }
  }]).then(answer => {
    const p = ora()
    p.start('创建中...')
    const gitUrl = 'https://github.com/dragonnahs/react-ssr-typescript.git'
    exec(`git clone ${gitUrl} ${answer.projectName}`, (error, stdout, stderr) => {
      if (error) { // 当有错误时打印出错误并退出操作
        console.log(chalk.red('项目创建失败'))
        process.exit()
      }
      fs.readFile(`${process.cwd()}/${answer.projectName}/package.json`, (err, data) => {
        if(err){
          console.log(chalk.red('读取文件失败'))
          process.exit()
        }
        data = JSON.parse(data.toString())
        data.name = answer.projectName
        fs.writeFile(`${process.cwd()}/${answer.projectName}/package.json`,JSON.stringify(data,"","\t"), err=>{
          p.stop()
          if(err){
            console.log(chalk.red('写入文件失败'))
            process.exit()
          }
          console.log(chalk.green('创建完成'))
          console.log(chalk.yellow(`cd ${answer.projectName}`))
          console.log(chalk.yellow(`npm install or yarn`))
          process.exit() // 退出这次命令行操作
        })
      })
    })
  })
}
