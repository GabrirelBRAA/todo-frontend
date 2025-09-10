import { Nav } from "../nav/Nav";
import styles from "./style.module.css";
import { itemService, type Item } from "../../services/itemService";
import { useEffect, useState, type FormEventHandler, type JSX } from "react";
import { LoaderCircle } from "../loader/LoaderCircle";
import { SpanError } from "../forms/spanerror";
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

interface CreateItemFormErrors {
	title: null | JSX.Element;
	description: null | JSX.Element;
	backend: null | JSX.Element;
}

function CreateItemForm({
	closeModal,
	refreshState,
}: {
	closeModal: () => void;
	refreshState: () => void;
}) {
	const [formErrors, setFormErrors] = useState<CreateItemFormErrors>();

	const submitCreateItemForm: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
        const currentTarget = e.currentTarget;
		const form = new FormData(e.currentTarget);
		const newErrors: CreateItemFormErrors = {
			title: null,
			description: null,
			backend: null,
		};
		if (!form.get("title")) {
			newErrors.title = <SpanError errorString="*required" />;
		}
		if (!form.get("description")) {
			newErrors.description = <SpanError errorString="*required" />;
		}
		if (newErrors.title == null && newErrors.description == null) {
			//create item
			try {
				await itemService.create({
					title: form.get("title")!.toString(),
					description: form.get("description")!.toString(),
				});
				closeModal();
				await refreshState();
				currentTarget.reset(); //reseting form
			} catch (e: unknown) {
				if (e instanceof Error) {
					//Need to put the backend errors somewhere on the UI
					newErrors.backend = <SpanError errorString={"*" + e.message} />;
					setFormErrors(newErrors);
				}
			}
		} else {
			setFormErrors(newErrors);
		}
	};

	return (
		<form onSubmit={submitCreateItemForm}>
			<label>
				{formErrors?.title}
				<input type="text" name="title" placeholder="Title" />
			</label>
			<label>
				{formErrors?.description}
				<textarea name="description" />
			</label>
			<button type="submit">Save</button>
		</form>
	);
}

function Modal({
	open,
    form,
	closeModal,
    title
}: {
	open: boolean;
    form: JSX.Element
	closeModal: () => void;
	refreshState: () => void;
    title: string
}) {
	return (
		<>
			{open ? <div className={styles.modaloverlay}></div> : null}
			<dialog open={open} className={styles.modal}>
				<h2>{title}</h2>
				<button className={styles.closebutton} onClick={closeModal}>
					X
				</button>
                {form}
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
	const [modalOpen, setModalOpen] = useState(false);

	const closeModal = () => {
		setModalOpen(false);
	};

	const openModal = () => {
		setModalOpen(true);
	};

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
				<button className={styles.addbutton} onClick={openModal}>
					New
				</button>
				<Modal
					open={modalOpen}
                    form={<CreateItemForm refreshState={getItems} closeModal={closeModal}/>}
					closeModal={closeModal}
					refreshState={getItems}
                    title={"Create new item"}
				/>
				{itemsComponents.length > 0 ? (
					<>
						<div className={styles.listcontainer}>{itemsComponents}</div>
						<div>Pagination {totalCount}</div>
					</>
				) : (
					<LoaderCircle />
				)}
			</div>
		</>
	);
}
