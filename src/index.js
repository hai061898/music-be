import dotenv from 'dotenv'
import express from 'express'
import { songs, users } from './database/data_song'
import pool from './database/dataconnect'
import faces from './utils/face'
import errorHandler from './middlewares/error_handler'

import search from './routes/search.js'
import songroute from './routes/songs.js'
import tags from './routes/tags.js'
import user from './routes/user.js'

dotenv.config({ path: '.env' })


const app = express()
const PORT = process.env.PORT || 3000


app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/', (req, res) => res.json('welcome to the api'))

app.get('/artists', async (req, res) => {
	let allartists = []
	let newdata = []
	songs.map((artist) => allartists.push(artist.artist))
	allartists = allartists.filter(function (value, index, array) {
		return array.indexOf(value) === index
	})
	allartists.map((artist) =>
		newdata.push({
			...users[allartists.indexOf(artist)],
			artist,
			url: faces[allartists.indexOf(artist)],
		})
	)

	for (let i = 0; i < newdata.length; i++) {
		console.log(newdata[i])
		await pool.query(
			`insert into songappusers
	            (id, username,first_name, last_name,email,city, avatar) values ($1, $2, $3, $4,$5,$6,$7)`,
			[
				newdata[i].id,
				newdata[i].artist,
				newdata[i].first_name,
				newdata[i].last_name,
				newdata[i].email,
				newdata[i].from,
				newdata[i].url,
			]
		)
	}

	res.send({ le: newdata })
})
app.get('/songs', async (req, res) => {
	for (let i = 0; i < songs.length; i++) {
		await pool.query(
			`insert into songs 
                  (songname,userid, trackid,tags,duration, cover_image_url) values ($1, $2, $3, $4,$5,$6)`,
			[
				songs[i].name,
				songs[i].artist,
				songs[i].track,
				songs[i].tags,
				songs[i].duration,
				songs[i].cover_image,
			]
		)
	}
	res.send({ le: 'hello' })
})

app.use('/tags', async (req, res) => {
	let tags = []
	let cover = []
	let final = []
	songs.map((song) => {
		tags.push(...song.tags)
	})
	tags = tags.filter(function (value, index, array) {
		return (
			array.indexOf(value) === index &&
			!value.includes('free') &&
			!value.includes('music')
		)
	})
	songs.map((song) => {
		cover.push(song.cover_image)
	})
	tags.map((tag) => {
		final.push({ tag: tag, coverImage: cover[tags.indexOf(tag)] })
	})

	res.send({ num: tags.length, results: final })
})

app.use('/api/v1/', user)
app.use('/api/v1/songs/', songroute)
app.use('/api/v1/tags/', tags)
app.use('/api/v1/search/', search)
app.use(errorHandler)


app.listen(PORT, () => console.log('listening on port 3000'))