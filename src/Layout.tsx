import { useCallback, useState, useEffect } from 'react';
import AutoComplete, { ItemType } from './components/AutoComplete';

const ITMES = [
	'north',
	'south',
	'east',
	'west',
	'north-east',
	'south-west',
	'south-east',
];
const ITMES_OBJ = [
	{
		name: 'Stanford University',
	},
	{ name: 'Harvard University' },
	{ name: 'Massachusetts Institute of Technology' },
	{ name: 'University of Oxford' },
	{ name: 'National University of Singapore' },
];

const data = {
	// apiEndPoint: `https://api.jikan.moe/v4/anime?page=1&limit=2&q=naru`,
	// apiEndPoint: `https://api.jikan.moe/v4/anime?page=1&limit=2`,
	// apiEndPoint: `https://kitsu.io/api/edge/anime?page[limit]=10&page[offset]=0`,
	apiEndPoint: `https://kitsu.io/api/edge/anime?page[limit]=20&page[offset]=0&filter[categories]=adventure`,
	searchKey: `filter[text]`,

	// apiEndPoint: `https://api.geckoterminal.com/api/v2/search/pools?page=1`,
	// searchKey: 'query',
	// apiEndPoint: `http://universities.hipolabs.com/search?country=India`,
	// searchKey: `name`,
};

const NoneText = '-----------------------';
export default function Layout() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [finalValue, setFinalValue] = useState<any>({
		static_string_auto: '',
		static_object_auto: '',
		dynamic_object_auto: '',
	});

	const fetchList = useCallback(
		async (text: string) => {
			const { apiEndPoint, searchKey } = data || {};
			setLoading(true);

			if (items.length && !text) {
				setItems([]);
				setLoading(false);
				return;
			}
			const response = await fetch(`${apiEndPoint}&${searchKey}=${text}`);
			let list = await response.json();

			// list = list.data.map(({ name, alpha_two_code }: any) => {
			list = list.data.map(({ attributes }: any) => {
				// return {
				// 	title: name,
				// 	poster: alpha_two_code,
				// };
				// return {
				// 	title: attributes.name,
				// 	poster: attributes.base_token_price_usd,
				// };
				return {
					title: attributes.canonicalTitle,
					poster: attributes.posterImage.small,
				};
			});

			setLoading(false);
			setItems(list);
		},
		[items]
	);

	const handleSubmit = useCallback(
		(val: Record<string, any>) => {
			setFinalValue({ ...finalValue, ...val });
		},
		[setFinalValue, finalValue]
	);
	return (
		<div className="layout-div">
			<div className="title-wrapper">
				<h4 className="title">Static string based:</h4>

				<div className="autoccomplete-wrapper-div">
					<AutoComplete
						placeholder="Search directions, ex north..."
						key={'raw'}
						items={ITMES}
						onSubmit={(val: ItemType) =>
							handleSubmit({ static_string_auto: val })
						}
					></AutoComplete>
					<span>{finalValue.static_string_auto || NoneText}</span>
				</div>
			</div>
			<div className="title-wrapper">
				<h4 className="title">Static object based:</h4>

				<div className="autoccomplete-wrapper-div">
					<AutoComplete
						items={[...ITMES_OBJ]}
						onSubmit={(val: ItemType) =>
							handleSubmit({ static_object_auto: val })
						}
						inputPath="name"
						placeholder="Search institutes like harvard..."
					></AutoComplete>
					<span>{finalValue.static_object_auto.name || NoneText}</span>
				</div>
			</div>
			<div className="title-wrapper">
				<h4 className="title">Dynamic object based:</h4>

				<div className="autoccomplete-wrapper-div">
					<AutoComplete
						items={items}
						onSubmit={(val: ItemType) =>
							handleSubmit({ dynamic_object_auto: val })
						}
						onChange={fetchList}
						inputPath="title"
						loading={loading}
						staticList={false}
						placeholder="Search anime name here, ex one piece"
					></AutoComplete>
					<span>{finalValue.dynamic_object_auto.title || NoneText}</span>
				</div>
			</div>
		</div>
	);
}
