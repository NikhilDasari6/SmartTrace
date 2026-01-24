const db = require("./config/db");

(async () =>{ 
	const [rows] = await db.query("SELECT NOW() AS time");
	console.log(rows);
	process.exit();
}) ();
