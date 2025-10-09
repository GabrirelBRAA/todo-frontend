import { Nav } from "../nav/Nav";
import styles from "./style.module.css";
import { itemService, type Item } from "../../services/itemService";
import {
	useEffect,
	useState,
	type FormEventHandler,
	type JSX,
	useRef,
	type MouseEventHandler,
} from "react";
import { LoaderCircle } from "../loader/LoaderCircle";
import { SpanError } from "../forms/spanerror";
// top nav
// add button
// dialog to create item
// list of users items
// paginator component

interface TagData{
    id: string
    color: string
    name: string
}

//This is horryfing, a really sad state of affairs
//This could be a usecase for a trie, sad
function EditTagForm(){
	return (
		<form>
            <input type="hidden" name="id"/>
            <input type="search"/>
            <select>
                <option>data1</option>
                <option>data2</option>
            </select>
            <div className="flex-thing">
			<label className="taginput">
                <span>TagName2</span>
                <input type="hidden" name="tag-id" value={1}/>
                <button>X</button>
			</label>
			<label className="taginput">
                <span>TagName</span>
                <input type="hidden" name="tag-id" value={2}/>
			</label>
            </div>
			<button type="submit">Save</button>
		</form>
	);
}

//Here a function is passed to access editTagForm
function TagList(){

    const tagsDataList = [
        {id: '1', color: "red", name: "tag1"},
        {id: '1', color: "green", name: "tag1"},
        {id: '1', color: "blue", name: "tag1"},
    ]

    const tags = tagsDataList.map(data => <Tag tagData={data}/>)
    return <div className={styles.taglist}>
        {tags}
    </div>
}

function Tag({tagData}: {tagData: TagData}){
    return <span className={styles.tag} style={{backgroundColor: tagData.color}}>{tagData.name}</span>
}

function Item({
	item,
	updateEditForm,
}: {
	item: Item;
	updateEditForm: (title: string, description: string, id: string) => void;
}) {
	const handleClick = () => {
		updateEditForm(item.title, item.description, item.id!);
	};

	return (
		<div onClick={handleClick} className={styles.item}>
			<div className={styles.itemheader}>{item.title}</div>
			<div>{item.description}</div>
            <TagList/>
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
				setFormErrors(newErrors);
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

function ConfirmDelete({
	open,
	close,
	action,
}: {
	open: boolean;
	close: (e: Event) => void;
	action: MouseEventHandler;
}) {
	const dialog = useRef<HTMLDialogElement>(null);

	function hideOnClickOutside(element: HTMLDialogElement) {
		const outsideClickListener: EventListener = (event) => {
			if (!element.contains(event.target as Node) && open == true) {
				// or use: event.target.closest(selector) === null
                close(event)
				//element.style.display = "none";
				removeClickListener();
			}
		};

		const removeClickListener = () => {
			document.removeEventListener("click", outsideClickListener);
		};

		document.addEventListener("click", outsideClickListener);
        return removeClickListener
	}

	useEffect(() => {
		const remove = hideOnClickOutside(dialog.current!);
        return remove
	}, [open, action]);

	return (
		<dialog ref={dialog} className={styles.confirmmodal} open={open}>
			<h2>Are you sure you want to delete this?</h2>
			<button onClick={action}>Yes</button>
			<button onClick={(e) => close(e.nativeEvent)}>No</button>
		</dialog>
	);
}

const useEditForm = (openModal: () => void) => {
	const form = useRef<HTMLFormElement>(null);
	const updateForm = (title: string, description: string, id: string) => {
		if (form.current != null) {
			(form.current.elements.namedItem("title") as HTMLInputElement)!.value =
				title;
			(form.current.elements.namedItem(
				"description"
			) as HTMLInputElement)!.value = description;
			(form.current.elements.namedItem("id") as HTMLInputElement)!.value = id;
			openModal();
		}
	};
	return [updateForm, form] as const;
};

interface EditItemFormErrors {
	title: null | JSX.Element;
	description: null | JSX.Element;
	backend: null | JSX.Element;
}

function EditItemForm({
	formRef,
	refreshState,
	closeOuterModal,
}: {
	formRef: React.RefObject<HTMLFormElement | null>;
	refreshState: () => void;
	closeOuterModal: () => void;
}) {
	const [formErrors, setFormErrors] = useState<EditItemFormErrors>();
	const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

	const closeModal = (e: Event) => {
		e.preventDefault();
		e.stopPropagation();
		setOpenConfirmDelete(false);
	};

	const openModal: MouseEventHandler = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setOpenConfirmDelete(true);
	};

	const handleDelete: MouseEventHandler = async (e) => {
		e.stopPropagation();
		e.preventDefault();
		const form = new FormData(formRef.current!); //previous added ref is being used here
		await itemService.delete(form.get("id")!.toString());
		await refreshState();
		closeOuterModal();
		setOpenConfirmDelete(false);
	};

	const submitEditItemForm: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
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
				await itemService.update({
					id: form.get("id")!.toString(),
					title: form.get("title")!.toString(),
					description: form.get("description")!.toString(),
				});
				closeOuterModal();
                setOpenConfirmDelete(false)
				await refreshState();
				setFormErrors(newErrors);
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
		<form ref={formRef} onSubmit={submitEditItemForm}>
			<input type="hidden" name="id" />
			<label>
				{formErrors?.title}
				<input type="text" name="title" placeholder="Title" />
			</label>
			<label>
				{formErrors?.description}
				<textarea name="description" />
			</label>
			<div>
				<button type="submit">Save</button>
				<button className={styles.deletebutton} onClick={openModal}>
					Delete
				</button>
				<ConfirmDelete
					open={openConfirmDelete}
					close={closeModal}
					action={handleDelete}
				/>
			</div>
		</form>
	);
}

function Modal({
	open,
	form,
	closeModal,
	title,
}: {
	open: boolean;
	form: JSX.Element;
	closeModal: () => void;
	title: string;
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

function usePagination(totalCount: number, currentPage: number){
    const totalPages = Math.ceil(totalCount/12);
    currentPage += 1;
    const outPagesLink = [currentPage];

    let linkCount = 4;
    while(linkCount > 0){
        let stillRightSpace = false;
        let stillLeftSpace = false;
        if(outPagesLink.at(-1) != totalPages){
            outPagesLink.push(outPagesLink[outPagesLink.length - 1] + 1);
            linkCount -= 1;
            stillRightSpace = true;
        }
        if(outPagesLink[0] != 1){
            outPagesLink.unshift(outPagesLink[0] - 1);
            linkCount -= 1;
            stillLeftSpace = true
        }
        if (!stillRightSpace && !stillLeftSpace){
            break;
        }
        console.log(outPagesLink)
    }

    let arrowLeft = null;
    let arrowRight = null;
    if(outPagesLink[outPagesLink.length - 1] != currentPage){
        arrowRight = currentPage + 1;
        if(outPagesLink[outPagesLink.length - 1] != totalPages){
            if(outPagesLink[outPagesLink.length - 1] != totalPages - 1){
                outPagesLink.push(-1);
            }
            outPagesLink.push(totalPages);
        }
       
    }
    if(outPagesLink[0] != currentPage){
        arrowLeft = currentPage - 1;
        if(outPagesLink[0] != 1){
            if(outPagesLink[0] != 2){
                outPagesLink.unshift(-1);
            }
            outPagesLink.unshift(1);
        }
    }
    console.log(outPagesLink)

    return [outPagesLink, arrowLeft, arrowRight] as const
}

export function MainApp() {
	const [paginatedItems, setPaginatedItems] = useState<Map<number, Item[]>>(new Map());
	const [totalCount, setTotalCount] = useState<number>(0);
	const [modalOpen, setModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
    const [paginationIndex, setPaginationIndex] = useState(0);
    const [outPagesLink, arrowLeft, arrowRight] = usePagination(totalCount, paginationIndex);

	const closeEditModal = () => {
		setEditModalOpen(false);
	};

	const openEditModal = () => {
		setEditModalOpen(true);
	};

	const [updateForm, form] = useEditForm(openEditModal);

	const closeModal = () => {
		setModalOpen(false);
	};

	const openModal = () => {
		setModalOpen(true);
	};

    const clearCacheDelete = (paginationIndex: number) => {
        const newMap = new Map(paginatedItems);
        for(const key of newMap.keys()){
            if (key >= paginationIndex){
                newMap.delete(key);
            }
        }
        setPaginatedItems(newMap)
        getItems(paginationIndex);
    }

	async function getItems(paginationIndex: number) {
		const items = await itemService.list(paginationIndex, 12);
		await timeout(1000);
        const newMap = new Map<number, Item[]>(paginatedItems);
        newMap.set(paginationIndex, items.items)
		setPaginatedItems(newMap);
		setTotalCount(items.total_count);
		console.log(items);
	}
    for(const key of paginatedItems.keys()){
        console.log('key', key)
        if (key >= paginationIndex){
            console.log("Bigger")
        }
    }

	useEffect(() => {
        if (!paginatedItems.has(paginationIndex)){
		getItems(paginationIndex);
        }
	}, [paginationIndex, paginatedItems]);

    //Todo refactor this logic because its ugly
    let itemsComponents;
    const items = paginatedItems.get(paginationIndex)
    if (items == undefined){
        itemsComponents = <LoaderCircle/>
    } else if (items.length == 0){
        itemsComponents = "You have no items, start by creating a new one."
    } else { 
        console.log(outPagesLink)
        const paginatedLinks = outPagesLink!.map((i, index) => {
            if (i == -1){
                return <button className={styles.paginationbutton} key={index}>{"..."}</button>
            }
            return <button className={styles.paginationbutton} style={i - 1 == paginationIndex ? {backgroundColor: "green"} : undefined} key={index} onClick={() => setPaginationIndex(i - 1)}>{i}</button>
    })
        itemsComponents = items.map((item, index) => (
            <Item key={index} item={item} updateEditForm={updateForm} />
        ));
        itemsComponents =  <>
						<div className={styles.listcontainer}>{itemsComponents}</div>
						<div>{paginatedLinks}</div>
					</>
    }

	return (
		<>
			<Nav />
			<div className={styles.container}>
				<button className={styles.addbutton} onClick={openModal}>
					New
				</button>
				<Modal
					open={editModalOpen}
					form={
						<EditItemForm
							formRef={form}
							closeOuterModal={closeEditModal}
							refreshState={() => clearCacheDelete(paginationIndex)}
						/>
					}
					closeModal={closeEditModal}
					title={"Edit item"}
				/>
				<Modal
					open={modalOpen}
					form={
						<CreateItemForm refreshState={() => clearCacheDelete(paginationIndex)} closeModal={closeModal} />
					}
					closeModal={closeModal}
					title={"Create new item"}
				/>
                {itemsComponents}
			</div>
		</>
	);
}
