import { Nav } from "../nav/Nav";
import styles from "./style.module.css";
// top nav
// add button
// dialog to create item
// list of users items
// paginator component

function Item() {
	return (
		<div className={styles.item}>
			<div className={styles.itemheader}>header</div>
			<div>content</div>
		</div>
	);
}

export function MainApp() {
	return (
		<>
			<Nav />
			<div className={styles.container}>
				<button className={styles.addbutton}>New</button>
				<div className={styles.listcontainer}>
					<Item />
					<Item />
					<Item />
					<Item />
					<Item />
					<Item />
					<Item />

				</div>
			</div>
		</>
	);
}
