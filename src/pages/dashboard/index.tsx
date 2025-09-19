import { tss } from "tss-react";

export default function Dashboard() {
	const { classes } = useStyles();
	return (
		<div className={classes.main}>
			<h1>Dashboard</h1>
		</div>
	);
}

const useStyles = tss.withName(Dashboard.name).create({
	main: {
		display: "grid",
	},
});
