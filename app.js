var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const { check } = require('express-validator')

const QRCode = require('qrcode')

const config = require('./config.json')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', function (req, res, next) {
	res.redirect(config.default)
})

app.get(
	'/:marker',
	[check('marker').isString().trim().escape()],
	function (req, res, next) {
		let marker = req.params.marker

		if (
			marker !== undefined &&
			typeof marker === 'string' &&
			config.redirects[marker] !== undefined
		)
			res.redirect(config.redirects[req.params.marker])
		else res.json({ result: 'ERROR', message: 'Missing or invalid marker' })
	}
)

app.get(
	'/:marker/qr',
	[check('marker').isString().trim().escape()],
	function (req, res, next) {
		let marker = req.params.marker

		if (
			marker !== undefined &&
			typeof marker === 'string' &&
			config.redirects[marker] !== undefined
		) {
			QRCode.toDataURL(
				config.redirects[marker],
				{ size: 500, scale: 25, qzone: 5 },
				function (err, url) {
					if (err) {
						console.log('error: ' + err)
						res.json({
							result: 'ERROR',
							message: 'Error while generating QR code'
						})
					}

					res.render('qr', { marker, url })
				}
			)
		} else
			res.json({ result: 'ERROR', message: 'Missing or invalid marker' })
	}
)

module.exports = app
