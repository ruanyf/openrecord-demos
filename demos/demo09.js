const Store = require('openrecord/store/sqlite3')

const store = new Store({
  file: './sample.db'
})

class Employee extends Store.BaseModel{
  static definition() {
    this.scope('managers');
  }

  static managers(){
    this.where({Title: 'General Manager'})
  }

  FullName(){
    return this.FirstName + ' ' + this.LastName
  }
}
store.Model(Employee)

store.ready(async () => {
  const employees = await Employee.managers();
  console.log(employees)
}).then(() => {
  console.log('执行完成');
  process.exit(0);
});
