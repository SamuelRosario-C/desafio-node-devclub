const express = require('express')
const uuid = require('uuid')
const app = express()
const port = 3000
app.use(express.json())

const pedidos = []

const verificarId = (request, response, next) => {

    const { id } = request.params
    const index = pedidos.findIndex(pedido => pedido.id === id)

    if (index < 0) {
        return response.status(404).json({ mg: 'error' })

    }

    request.foodIndex = index
    request.foodId = id
    next()
}

const verificarUrl = (request, response, next) => {


    console.log(`Host: ${request.headers.host} - URL: ${request.url} - METHOD: ${request.method}`);
    next()
}

app.post('/order', verificarUrl, (request, response) => {

    const { order, clientName, price, status } = request.body

    const novospedidos = { id: uuid.v4(), order, clientName, price, status }

    pedidos.push(novospedidos)

    return response.status(201).json(novospedidos)
})

app.get('/order', verificarUrl, (request, response) => {
    response.json(pedidos)
})

app.put('/order/:id', verificarUrl, verificarId, (request, response) => {

    const id = request.foodId
    const index = request.foodIndex
    const { order, clientName, price, status } = request.body
    const pedidoAtualizado = { id, order, clientName, price, status }

    pedidos[index] = pedidoAtualizado

    return response.json(pedidoAtualizado)

})

app.delete('/order/:id', verificarUrl, verificarId, (request, response) => {
    const index = request.foodIndex

    pedidos.splice(index, 1)


    return response.status(204).json()
})


app.get('/order/:id', verificarUrl, verificarId, (request, response) => {

    const index = request.foodIndex
    const exibirPedido = pedidos[index]

    return response.json(exibirPedido)
})

app.patch('/order/:id', verificarUrl, verificarId, (request, response) => {

    const index = request.foodIndex
    pedidos[index].status = "Pronto"

    return response.json(pedidos[index])

})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})