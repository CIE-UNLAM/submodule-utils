/*
Campo input:Objeto o array a sanitizar
        Ej: { dni = "30123465" , nombre="test", "apellido"="probando", email="test@gmail.com"}
fields: objeto con los campos nuevos
        Ej: let ej = { dni : "" , email: ""}
La funcion retorna una copia del input que solo contiene los campos requeridos
        Ej: { dni = "30123465" , email="test@gmail.com"}
 */

export function fieldTrimmer(input: any, fields: any) {

    if (Array.isArray(input)) {
        let newList: any[]
        newList = []
        Object.entries(input).forEach(([index]) => {
            Object.entries(fields).forEach(([key, values]) => {
                // @ts-ignore
                fields[key] = input[index][key]

            })
            newList.push(Object.assign({}, fields))
        })
        return newList
    } else {
        let newObj: any = {}
        Object.entries(fields).forEach(([key, values]) => {
            // @ts-ignore
            fields[key] = input[key]
        })
        Object.assign(newObj, fields)
        return newObj
    }

}
