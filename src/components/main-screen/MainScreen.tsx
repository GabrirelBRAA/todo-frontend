import { Nav } from "../nav/Nav";
import styles from "./style.module.css";
import { itemService, type Item } from "../../services/itemService";
import { useEffect, useState } from "react";
// top nav
// add button
// dialog to create item
// list of users items
// paginator component

function Item({item}: {item: Item}) {
	return (
		<div className={styles.item}>
			<div className={styles.itemheader}>{item.title}</div>
			<div>{item.description}</div>
		</div>
	);
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function MainApp() {

    const [items, setItems] = useState<Array<Item>>([])

    async function getItems(){
        const items = await itemService.list(0, 12)
        await timeout(1000)
        setItems(items)
        console.log(items)
    }

    useEffect(() => {
        getItems()
    }, [])

    const itemsComponents = items.map((item, index) => <Item key={index} item={item}/>)

	return (
		<>
			<Nav />
			<div className={styles.container}>
				<button className={styles.addbutton}>New</button>
				<div className={styles.listcontainer}>
                    {itemsComponents}

				</div>
                <div>Pagination</div>
			</div>
		</>
	);
}
