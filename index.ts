import * as cloud from "@pulumi/cloud-aws"

const counterTable = new cloud.Table("counterTable", "route")
const endpoint = new cloud.API("hello-world")
endpoint.get("/{route+}", (req: any, res: any) => {
    let route = req.params["route"];
    console.log(`Getting count for '${route}'`);
    counterTable.get({ route }).then(value => {
        let count = (value && value.count) || 0
        counterTable.insert({ route, count: ++count }).then(() => {
            res.status(200).json({ route, count })
            console.log(`Got count ${count} for '${route}'`)
        })
    })
})

exports.endpoint = endpoint.publish().url