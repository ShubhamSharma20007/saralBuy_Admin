export const currenySymbol= (val:number)=>{
  return val ?  new Intl.NumberFormat('en-IN').format(val) : 0
}