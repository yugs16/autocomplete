import React, { KeyboardEvent, MouseEvent, useEffect, useState } from 'react';
import './style.css';
import { useDebounce } from './useDebounce';

export type ItemType = string | Record<string, any>;

interface AutoCompleteProps {
	items?: ItemType[];
	inputPath?: string;
	loading?: boolean;
	noItemMathch?: string;
	onSubmit: (val: ItemType) => void;
	onChange?: (text: string) => void;
	staticList?: boolean;
	placeholder?: string;
}

function getHighlightedString(str: string, start: number, end: number) {
	if (!str) return;
	const prefix = str.slice(0, start);
	const middle = str.slice(start, end);
	const suffix = str.slice(end, str.length);

	return (
		<span>
			{prefix}
			<b className="hightlight">{middle}</b>
			{suffix}
		</span>
	);
}

const NO_RECORD_MATCH_DEFAULT_TEXT = 'No records found....';

export default function AutoComplete(props: AutoCompleteProps) {
	const {
		items = [],
		inputPath,
		loading,
		staticList = true,
		noItemMathch = NO_RECORD_MATCH_DEFAULT_TEXT,
		onSubmit,
		onChange,
		placeholder,
	} = props;
	const [value, setValue] = useState('');
	const [list, setList] = useState<ItemType[]>([]);
	const [matches, setMatches] = useState<[number, number][]>([]);
	const [init, setInit] = useState(true);
	const [activeIndex, setActiveIndex] = useState<number>(0);

	if (items.length && typeof items[0] === 'object' && !inputPath) {
		throw new Error('inputPath prop is mandatory for list of object types');
	}

	if (items.length && typeof items[0] === 'string' && inputPath) {
		throw new Error('inputPath prop is not required for list of strings');
	}

	if (!staticList && !onChange) {
		throw new Error('onChange function is required when staticList=false');
	}

	useEffect(() => {
		/*execute a function when someone clicks in the document:*/
		document.addEventListener('click', function () {
			setList([]);
			setActiveIndex(0);
		});
	}, []);

	function updateList(text: string) {
		const newMatches: [number, number][] = [];

		const filteredItems = items.filter((item: ItemType) => {
			const regex = new RegExp(`${text}`, 'i');
			const val = inputPath ? item[inputPath as keyof ItemType] : item;
			const rs = val.match(regex);
			if (rs) {
				// adding matching string indexes to matchers array, will be used later to highlight the matching substring
				newMatches.push([rs.index, rs.index + text.length]);
			}
			return rs;
		});

		setMatches(newMatches);

		if (value)
			setList(
				filteredItems.length
					? filteredItems
					: [inputPath ? { [inputPath as string]: noItemMathch } : noItemMathch]
			);
	}

	useEffect(() => {
		if (init) {
			setInit(false);
			return;
		}
		if (!staticList) {
			updateList(value);
		}
	}, [items, staticList, init]);

	function callParentOnChange(text: string) {
		if (onChange) onChange(text);

		if (!text) setList([]);
	}
	const debouncedFn = useDebounce(callParentOnChange, 500);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const text = event.target.value;

		// if (text.length < 2) return;

		setValue(text);
		if (!text) {
			setList([]);
			callParentOnChange(text);
			return;
		}

		debouncedFn(text);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const text = event.target.value;
		event.stopPropagation();
		setValue(text);

		if (text.length) {
			updateList(text);
		} else {
			setList([]);
		}
	};

	function onKeyDown(event: KeyboardEvent) {
		if (event.code === 'Enter') {
			handleSubmit(
				activeIndex >= 0 && activeIndex < list.length ? list[activeIndex] : ''
			);
		}
		if (event.code === 'ArrowUp') {
			if (activeIndex <= 0) {
				setActiveIndex(list.length - 1);
			} else setActiveIndex(activeIndex - 1);
		}
		// User pressed the down arrow, increment the index
		else if (event.code === 'ArrowDown') {
			if (activeIndex >= list.length - 2) {
				setActiveIndex(0);
			} else setActiveIndex(activeIndex + 1);
		}
	}

	useEffect(() => {
		const ulElem = document.getElementById('item-list');
		const targetLi = document.getElementById(`li-${activeIndex}`); // id tag of the <li> element

		if (ulElem && targetLi) ulElem.scrollTop = targetLi.offsetTop - 50;
	}, [activeIndex]);

	const handleSubmit = (value: string | Record<string, any>) => {
		setList([]);
		setActiveIndex(0);

		if (inputPath && typeof value === 'object') {
			setValue(value[inputPath]);
			onSubmit(value);
		} else {
			setValue(value as string);
			onSubmit(value);
		}
	};
	function handleAutocompleteClick(event: MouseEvent<HTMLDivElement>) {
		event.stopPropagation();
	}

	return (
		<div className="autocomplete-wrapper" onClick={handleAutocompleteClick}>
			<input
				type="text"
				value={value}
				onFocus={handleChange}
				onChange={staticList ? handleChange : handleInputChange}
				onKeyDown={onKeyDown}
				placeholder={placeholder}
			/>
			{(list.length || loading) && (
				<ul className="items-list" id="item-list">
					{loading && value && <li key={'loading-li'}>Loading....</li>}
					{list.map((item, index) => {
						const itemText = inputPath
							? item[inputPath as keyof ItemType]
							: item;

						let showActive = true;

						if (itemText === noItemMathch) showActive = false;
						return (
							<li
								id={`li-${index}`}
								key={`li-${index}-${itemText}-${value}`}
								onClick={(event) => {
									event?.stopPropagation();
									event?.preventDefault();
									staticList ? handleSubmit(item) : handleSubmit(item);
								}}
								className={index === activeIndex && showActive ? 'active' : ''}
							>
								<>
									{matches[index]
										? getHighlightedString(
												itemText,
												matches[index][0],
												matches[index][1]
										  )
										: inputPath
										? item[inputPath as keyof ItemType]
										: item}
								</>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
