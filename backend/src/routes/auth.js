const Router = require('express').Router
const jwt = require('jsonwebtoken')
var validator = require('validator')

module.exports = Router({ mergeParams: true }).post(
	'/auth',
	async (req, res, next) => {
		try {
			const { bearer } = req.body
			const { models } = req.db
			
			if(!validator.isJWT(bearer))
				return res.status(403).send({ valido: false, msg: 'Bearer inválido!' })

			const tokenVerify = jwt.verify(bearer, process.env.USER_KEY)
			if (!tokenVerify) return res.status(403).send({ valido: false, msg: 'Assinatura inválida!' })

			const usuario = await models.usuario.findByPk(tokenVerify.id)
			if (!usuario) return res.status(403).send({ valido: false, msg: 'Usuário não encontrado!' })

			if (usuario.inativo) return res.status(403).send({ valido: false, msg: 'Usuário inativo!' })

			const { id, nome, email, role, inativo } = usuario

			return res.json({ id, nome, email, role, inativo })
		} catch (error) {
			return next(error)
		}
	}
)
