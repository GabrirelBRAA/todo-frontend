import { Nav } from "../nav/Nav";
import styles from "./style.module.css";
import { itemService, type Item } from "../../services/itemService";
import { useEffect, useState } from "react";
// top nav
// add button
// dialog to create item
// list of users items
// paginator component

function Item({ item }: { item: Item }) {
	return (
		<div className={styles.item}>
			<div className={styles.itemheader}>{item.title}</div>
			<div>{item.description}</div>
		</div>
	);
}

function Modal({open, closeModal} : {open: boolean, closeModal: () => void}) {
	return (
		<>
			{open ? (<div className={styles.modaloverlay}></div>) : null}
			<dialog open={open} className={styles.modal}>
				<h2>Create new item</h2>
				<button className={styles.closebutton} onClick={closeModal}>X</button>
				<form>
					<label>
						<input type="text" placeholder="Title" />
					</label>
					<label>
						<textarea />
					</label>
					<button type="submit">Save</button>
				</form>
			</dialog>
		</>
	);
}

//just a test function that helps with slowing down queries
function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function MainApp() {
	const [items, setItems] = useState<Array<Item>>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
    const [modalOpen, setModalOpen] = useState(false)

    const closeModal = () => {
        setModalOpen(false)
    }

    const openModal = () => {
        setModalOpen(true)
    }

	async function getItems() {
		const items = await itemService.list(0, 12);
		await timeout(1000);
		setItems(items.items);
		setTotalCount(items.total_count);
		console.log(items);
	}

	useEffect(() => {
		getItems();
	}, []);

	const itemsComponents = items.map((item, index) => (
		<Item key={index} item={item} />
	));

	return (
		<>
			<Nav />
			<div className={styles.container}>
			    <button className={styles.addbutton} onClick={openModal}>New</button>
				<Modal open={modalOpen} closeModal={closeModal}/>
				<div className={styles.listcontainer}>{itemsComponents}</div>
				<div>Pagination {totalCount}</div>
			</div>
		</>
	);
}
