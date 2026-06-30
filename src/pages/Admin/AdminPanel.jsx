import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBoxOpen,
	faChartLine,
	faFileLines,
	faFolderTree,
	faGear,
	faImage,
	faLayerGroup,
	faMagnifyingGlassChart,
	faBullhorn,
	faPen,
	faPlus,
	faReceipt,
	faRotate,
	faTag,
	faTrash,
	faTriangleExclamation,
	faUpload,
	faBars,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import api, { API_BASE_URL } from "../../utils/api";

const imageFolder = "aston-reed/admin";

const emptyProduct = {
	name: "",
	type: "Eau de Parfum",
	badge: "",
	image: "/assets/img/reed/product_1.png",
	slug: "",
	description: "",
	price: "",
	stock: "",
	sku: "",
	category: "",
	status: "active",
	isFeatured: true,
};

const emptyCategory = {
	name: "",
	slug: "",
	description: "",
	status: "active",
	isFeatured: true,
};

const resourceConfigs = {
	pages: {
		title: "Pages",
		path: "/page",
		icon: faFileLines,
		empty: {
			title: "",
			slug: "",
			excerpt: "",
			content: "",
			featuredImage: "",
			status: "draft",
			seoTitle: "",
			seoDescription: "",
			seoKeywords: "",
		},
		fields: [
			["title", "Title", "text", { required: true, autoSlug: true }],
			["slug", "Slug", "text", { required: true }],
			["excerpt", "Excerpt", "textarea"],
			[
				"content",
				"Content",
				"textarea",
				{ required: true, wide: true },
			],
			["featuredImage", "Featured Image", "image"],
			[
				"status",
				"Status",
				"select",
				{ options: ["draft", "published"] },
			],
			["seoTitle", "SEO Title", "text"],
			["seoDescription", "SEO Description", "textarea"],
			["seoKeywords", "SEO Keywords", "tags"],
		],
		columns: ["title", "slug", "status"],
	},
	posts: {
		title: "Posts",
		path: "/post",
		icon: faFileLines,
		empty: {
			title: "",
			slug: "",
			excerpt: "",
			content: "",
			featuredImage: "",
			status: "draft",
			postCategory: "",
			seoTitle: "",
			seoDescription: "",
			seoKeywords: "",
		},
		fields: [
			["title", "Title", "text", { required: true, autoSlug: true }],
			["slug", "Slug", "text", { required: true }],
			["postCategory", "Post Category", "postCategory"],
			["excerpt", "Excerpt", "textarea"],
			[
				"content",
				"Content",
				"textarea",
				{ required: true, wide: true },
			],
			["featuredImage", "Featured Image", "image"],
			[
				"status",
				"Status",
				"select",
				{ options: ["draft", "published"] },
			],
			["seoTitle", "SEO Title", "text"],
			["seoDescription", "SEO Description", "textarea"],
			["seoKeywords", "SEO Keywords", "tags"],
		],
		columns: ["title", "slug", "status"],
	},
	postCategories: {
		title: "Post Categories",
		path: "/post-category",
		icon: faFolderTree,
		empty: { name: "", slug: "", description: "", status: "active" },
		fields: [
			["name", "Name", "text", { required: true, autoSlug: true }],
			["slug", "Slug", "text", { required: true }],
			["description", "Description", "textarea"],
			[
				"status",
				"Status",
				"select",
				{ options: ["active", "inactive"] },
			],
		],
		columns: ["name", "slug", "status"],
	},
	menus: {
		title: "Menus",
		path: "/menu",
		icon: faLayerGroup,
		empty: { name: "", location: "header", items: "[]" },
		fields: [
			["name", "Name", "text", { required: true }],
			[
				"location",
				"Location",
				"select",
				{ options: ["header", "footer", "mobile"] },
			],
			[
				"items",
				"Items JSON",
				"json",
				{
					wide: true,
					hint: '[{"label":"Shop","url":"/shop","order":1,"target":"_self"}]',
				},
			],
		],
		columns: ["name", "location"],
	},
	contentTypes: {
		title: "Content Types",
		path: "/content-type",
		icon: faFolderTree,
		empty: {
			name: "",
			slug: "",
			description: "",
			fields: '[{"name":"title","label":"Title","type":"text","required":true}]',
		},
		fields: [
			["name", "Name", "text", { required: true, autoSlug: true }],
			["slug", "Slug", "text", { required: true }],
			["description", "Description", "textarea"],
			["fields", "Fields JSON", "json", { wide: true }],
		],
		columns: ["name", "slug"],
	},
	contentEntries: {
		title: "Content Entries",
		path: "/content",
		icon: faFileLines,
		empty: { contentType: "", status: "draft", data: "{}" },
		fields: [
			[
				"contentType",
				"Content Type",
				"contentType",
				{ required: true },
			],
			[
				"status",
				"Status",
				"select",
				{ options: ["draft", "published"] },
			],
			["data", "Entry Data JSON", "json", { wide: true }],
		],
		columns: ["contentType", "status"],
	},
	banners: {
		title: "Banners",
		path: "/banner",
		icon: faImage,
		empty: {
			title: "",
			subtitle: "",
			image: "",
			buttonText: "",
			buttonLink: "",
			position: "homepage",
			order: 0,
			status: "active",
		},
		fields: [
			["title", "Title", "text", { required: true }],
			["subtitle", "Subtitle", "text"],
			["image", "Image", "image", { required: true }],
			["buttonText", "Button Text", "text"],
			["buttonLink", "Button Link", "text"],
			[
				"position",
				"Position",
				"select",
				{ options: ["homepage", "category", "sidebar", "popup"] },
			],
			["order", "Order", "number"],
			[
				"status",
				"Status",
				"select",
				{ options: ["active", "inactive"] },
			],
		],
		columns: ["title", "position", "status"],
	},
	coupons: {
		title: "Coupons",
		path: "/coupon",
		icon: faTag,
		empty: {
			code: "",
			description: "",
			type: "percentage",
			value: "",
			minOrderAmount: "",
			maxDiscount: "",
			usageLimit: "",
			startDate: "",
			expiryDate: "",
			status: "active",
		},
		fields: [
			["code", "Code", "text", { required: true }],
			["description", "Description", "textarea"],
			["type", "Type", "select", { options: ["percentage", "fixed"] }],
			["value", "Value", "number", { required: true }],
			["minOrderAmount", "Minimum Order Amount", "number"],
			["maxDiscount", "Max Discount", "number"],
			["usageLimit", "Usage Limit", "number"],
			["startDate", "Start Date", "date"],
			["expiryDate", "Expiry Date", "date"],
			[
				"status",
				"Status",
				"select",
				{ options: ["active", "inactive"] },
			],
		],
		columns: ["code", "type", "value", "status"],
	},
	notifications: {
		title: "Notifications",
		path: "/notification",
		icon: faBullhorn,
		empty: {
			title: "",
			message: "",
			type: "announcement",
			status: "active",
		},
		fields: [
			["title", "Title", "text", { required: true }],
			["message", "Message", "textarea", { required: true }],
			[
				"type",
				"Type",
				"select",
				{
					options: [
						"system",
						"order",
						"promotion",
						"announcement",
					],
				},
			],
			[
				"status",
				"Status",
				"select",
				{ options: ["active", "inactive"] },
			],
		],
		columns: ["title", "type", "status"],
	},
};

const adminGroups = [
	{ label: "Commerce", tabs: ["products", "categories", "orders"] },
	{
		label: "CMS",
		tabs: [
			"pages",
			"posts",
			"postCategories",
			"menus",
			"contentTypes",
			"contentEntries",
		],
	},
	{ label: "Marketing", tabs: ["banners", "coupons", "notifications"] },
	{ label: "System", tabs: ["settings", "seo"] },
];

const slugify = (value) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const formatMoney = (value) =>
	"INR " + Math.round(Number(value || 0)).toLocaleString("en-IN");

const parseArrayResponse = (data) =>
	Array.isArray(data?.data) ? data.data : [];

const normalizeForForm = (value) => {
	if (Array.isArray(value)) return value.join(", ");
	if (value && typeof value === "object")
		return value._id || JSON.stringify(value, null, 2);
	return value ?? "";
};

const normalizePayload = (form, config) => {
	const payload = {};
	config.fields.forEach(([name, , type]) => {
		const value = form[name];
		if (value === "" || value === undefined || value === null) return;

		if (type === "number") {
			payload[name] = Number(value);
			return;
		}
		if (type === "tags") {
			payload[name] = String(value)
				.split(",")
				.map((item) => item.trim())
				.filter(Boolean);
			return;
		}
		if (type === "json") {
			payload[name] =
				typeof value === "string"
					? JSON.parse(value || "{}")
					: value;
			return;
		}
		payload[name] = value;
	});
	return payload;
};

export default function AdminPanel() {
	const { user, token, isAuthenticated } = useSelector(
		(state) => state.auth,
	);
	const [activeTab, setActiveTab] = useState("products");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isProductModalOpen, setIsProductModalOpen] = useState(false);
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [orders, setOrders] = useState([]);
	const [resources, setResources] = useState({});
	const [settings, setSettings] = useState({});
	const [productForm, setProductForm] = useState(emptyProduct);
	const [categoryForm, setCategoryForm] = useState(emptyCategory);
	const [editingProductId, setEditingProductId] = useState(null);
	const [editingCategoryId, setEditingCategoryId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [notice, setNotice] = useState("");
	const [error, setError] = useState("");

	const isAdmin = isAuthenticated && user?.role === "admin";

	const authHeaders = useMemo(
		() => ({
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		}),
		[token],
	);

	const context = useMemo(
		() => ({
			postCategories: resources.postCategories || [],
			contentTypes: resources.contentTypes || [],
		}),
		[resources],
	);

	const categoryById = useMemo(() => {
		return categories.reduce((map, category) => {
			map[category._id] = category;
			return map;
		}, {});
	}, [categories]);

	const stats = useMemo(() => {
		const revenue = orders.reduce(
			(sum, order) => sum + Number(order.totalAmount || 0),
			0,
		);
		const lowStock = products.filter(
			(product) => Number(product.stock || 0) <= 30,
		).length;
		const pageCount = (resources.pages || []).length;
		const postCount = (resources.posts || []).length;
		return {
			revenue,
			products: products.length,
			categories: categories.length,
			orders: orders.length,
			lowStock,
			content: pageCount + postCount,
		};
	}, [categories.length, orders, products, resources]);

	const fetchJson = useCallback(async (path, options = {}) => {
		const method = options.method || "GET";
		const body = options.body ? JSON.parse(options.body) : undefined;

		if (method === "GET") {
			return api.get(path);
		}
		if (method === "POST") {
			return api.post(path, body);
		}
		if (method === "PUT") {
			return api.put(path, body);
		}
		if (method === "DELETE") {
			return api.delete(path);
		}

		return api.request(path, { ...options, body: options.body });
	}, []);

	const loadAdminData = useCallback(async () => {
		if (!isAdmin) {
			setLoading(false);
			return;
		}

		setLoading(true);
		setError("");
		try {
			const resourceEntries = Object.entries(resourceConfigs);
			const [
				productsData,
				categoriesData,
				ordersData,
				settingsData,
				...resourceResponses
			] = await Promise.all([
				fetchJson("/product?limit=100"),
				fetchJson("/category"),
				fetchJson("/order", { headers: authHeaders }),
				fetchJson("/settings"),
				...resourceEntries.map(([, config]) =>
					fetchJson(config.path),
				),
			]);
			setProducts(parseArrayResponse(productsData));
			setCategories(parseArrayResponse(categoriesData));
			setOrders(parseArrayResponse(ordersData));
			setSettings(settingsData.data || {});
			setResources(
				resourceEntries.reduce((acc, [key], index) => {
					acc[key] = parseArrayResponse(
						resourceResponses[index],
					);
					return acc;
				}, {}),
			);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [authHeaders, fetchJson, isAdmin]);

	useEffect(() => {
		loadAdminData();
	}, [loadAdminData]);

	useEffect(() => {
		document.body.classList.add("admin-page-active");
		return () => {
			document.body.classList.remove("admin-page-active");
		};
	}, []);

	const resetProductForm = () => {
		setEditingProductId(null);
		setProductForm(emptyProduct);
		setIsProductModalOpen(false);
	};

	const resetCategoryForm = () => {
		setEditingCategoryId(null);
		setCategoryForm(emptyCategory);
		setIsCategoryModalOpen(false);
	};

	const updateProductField = (field, value) => {
		setProductForm((current) => ({
			...current,
			[field]: value,
			...(field === "name" && !editingProductId
				? { slug: slugify(value) }
				: {}),
		}));
	};

	const updateCategoryField = (field, value) => {
		setCategoryForm((current) => ({
			...current,
			[field]: value,
			...(field === "name" && !editingCategoryId
				? { slug: slugify(value) }
				: {}),
		}));
	};

	const saveProduct = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError("");
		setNotice("");

		const payload = {
			...productForm,
			title: productForm.name,
			price: Number(productForm.price),
			stock: Number(productForm.stock || 0),
			badge: productForm.badge || null,
			sku: productForm.sku || undefined,
			category: productForm.category || undefined,
		};

		try {
			await fetchJson(
				editingProductId
					? `/product/${editingProductId}`
					: "/product",
				{
					method: editingProductId ? "PUT" : "POST",
					headers: authHeaders,
					body: JSON.stringify(payload),
				},
			);
			setNotice(
				editingProductId ? "Product updated." : "Product created.",
			);
			resetProductForm();
			await loadAdminData();
		} catch (err) {
			setError(err.message);
		} finally {
			setSaving(false);
		}
	};

	const editProduct = (product) => {
		setActiveTab("products");
		setEditingProductId(product._id);
		setProductForm({
			name: product.name || product.title || "",
			type: product.type || "Eau de Parfum",
			badge: product.badge || "",
			image:
				product.image ||
				product.images?.[0]?.url ||
				"/assets/img/reed/product_1.png",
			slug: product.slug || "",
			description: product.description || "",
			price: product.price || "",
			stock: product.stock || "",
			sku: product.sku || "",
			category:
				typeof product.category === "object"
					? product.category?._id || ""
					: product.category || "",
			status: product.status || "active",
			isFeatured: Boolean(product.isFeatured),
		});
		setIsProductModalOpen(true);
	};

	const deleteProduct = async (product) => {
		if (!window.confirm(`Delete ${product.name || product.title}?`))
			return;
		setError("");
		setNotice("");
		try {
			await fetchJson(`/product/${product._id}`, {
				method: "DELETE",
				headers: authHeaders,
			});
			setNotice("Product deleted.");
			await loadAdminData();
		} catch (err) {
			setError(err.message);
		}
	};

	const saveCategory = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError("");
		setNotice("");

		try {
			await fetchJson(
				editingCategoryId
					? `/category/${editingCategoryId}`
					: "/category",
				{
					method: editingCategoryId ? "PUT" : "POST",
					headers: authHeaders,
					body: JSON.stringify(categoryForm),
				},
			);
			setNotice(
				editingCategoryId
					? "Collection updated."
					: "Collection created.",
			);
			resetCategoryForm();
			await loadAdminData();
		} catch (err) {
			setError(err.message);
		} finally {
			setSaving(false);
		}
	};

	const editCategory = (category) => {
		setActiveTab("categories");
		setEditingCategoryId(category._id);
		setCategoryForm({
			name: category.name || "",
			slug: category.slug || "",
			description: category.description || "",
			status: category.status || "active",
			isFeatured: Boolean(category.isFeatured),
		});
		setIsCategoryModalOpen(true);
	};

	const deleteCategory = async (category) => {
		if (!window.confirm(`Delete ${category.name}?`)) return;
		setError("");
		setNotice("");
		try {
			await fetchJson(`/category/${category._id}`, {
				method: "DELETE",
				headers: authHeaders,
			});
			setNotice("Collection deleted.");
			await loadAdminData();
		} catch (err) {
			setError(err.message);
		}
	};

	const updateOrderStatus = async (orderId, orderStatus) => {
		setError("");
		setNotice("");
		try {
			await fetchJson(`/order/${orderId}/status`, {
				method: "PUT",
				headers: authHeaders,
				body: JSON.stringify({ orderStatus }),
			});
			setNotice("Order status updated.");
			await loadAdminData();
		} catch (err) {
			setError(err.message);
		}
	};

	if (!isAdmin) {
		return (
			<main className="admin-shell admin-shell--locked">
				<section className="admin-lock">
					<p className="admin-eyebrow">Aston Reed Atelier</p>
					<h1>Admin Access Required</h1>
					<p>
						Sign in with an administrator account to manage
						the store, CMS, SEO, and marketing operations.
					</p>
					<Link to="/login" className="admin-primary-action">
						Sign In
					</Link>
				</section>
			</main>
		);
	}

	return (
		<>
			<header className="admin-mobile-header">
				<button
					type="button"
					className="admin-menu-toggle"
					onClick={() => setSidebarOpen(true)}
					aria-label="Open menu"
				>
					<FontAwesomeIcon icon={faBars} />
				</button>
				<div className="admin-mobile-brand">
					<strong>Aston Reed</strong>
					<span>Admin Suite</span>
				</div>
				<button
					type="button"
					className="admin-mobile-refresh"
					onClick={loadAdminData}
					aria-label="Refresh data"
				>
					<FontAwesomeIcon icon={faRotate} />
				</button>
			</header>

			<div
				className={`admin-sidebar-backdrop ${sidebarOpen ? "admin-sidebar-backdrop--visible" : ""}`}
				onClick={() => setSidebarOpen(false)}
			/>

			<main className="admin-shell admin-console-shell">
				<aside
					className={`admin-side-nav ${sidebarOpen ? "admin-side-nav--open" : ""}`}
				>
					<div className="admin-side-brand">
						<span>AR</span>
						<div>
							<strong>Aston Reed</strong>
							<p>Admin Suite</p>
						</div>
						<button
							type="button"
							className="admin-sidebar-close"
							onClick={() => setSidebarOpen(false)}
							aria-label="Close menu"
						>
							<FontAwesomeIcon icon={faXmark} />
						</button>
					</div>
					{adminGroups.map((group) => (
						<div
							key={group.label}
							className="admin-nav-group"
						>
							<p>{group.label}</p>
							{group.tabs.map((tab) => (
								<button
									key={tab}
									type="button"
									className={
										activeTab === tab
											? "active"
											: ""
									}
									onClick={() => {
										setActiveTab(tab);
										setSidebarOpen(false);
									}}
								>
									<FontAwesomeIcon
										icon={tabIcon(tab)}
									/>
									{tabLabel(tab)}
								</button>
							))}
						</div>
					))}
				</aside>

				<section className="admin-console-main">
					<section className="admin-hero-panel">
						<div>
							<p className="admin-eyebrow">
								Aston Reed Administration
							</p>
							<h1>Atelier Command Center</h1>
							<p className="admin-hero-copy">
								Manage commerce, content, SEO,
								campaigns, and operational settings from
								one focused back office.
							</p>
						</div>
						<div className="admin-hero-actions">
							<button
								type="button"
								className="admin-ghost-action"
								onClick={loadAdminData}
							>
								<FontAwesomeIcon icon={faRotate} />{" "}
								Refresh
							</button>
						</div>
					</section>

					{(notice || error) && (
						<div
							className={`admin-alert ${error ? "admin-alert--error" : ""}`}
						>
							{error || notice}
						</div>
					)}

					<section className="admin-stat-grid">
						<StatCard
							icon={faChartLine}
							label="Revenue"
							value={formatMoney(stats.revenue)}
						/>
						<StatCard
							icon={faReceipt}
							label="Orders"
							value={stats.orders}
						/>
						<StatCard
							icon={faBoxOpen}
							label="Products"
							value={stats.products}
						/>
						<StatCard
							icon={faFileLines}
							label="Content"
							value={stats.content}
						/>
						<StatCard
							icon={faTriangleExclamation}
							label="Low Stock"
							value={stats.lowStock}
							tone="warn"
						/>
					</section>

					<section className="admin-workspace">
						{loading ? (
							<div className="admin-loading">
								Loading dashboard data...
							</div>
						) : (
							<>
								{activeTab === "products" && (
									<div className="admin-two-column">
										<ProductTable
											products={products}
											categoryById={
												categoryById
											}
											onEdit={editProduct}
											onDelete={deleteProduct}
											onAddClick={() =>
												setIsProductModalOpen(
													true,
												)
											}
										/>
										<Modal
											isOpen={
												isProductModalOpen
											}
											onClose={
												resetProductForm
											}
											title={
												editingProductId
													? "Edit Product"
													: "Create Product"
											}
											sizeClass="admin-modal-container--product"
										>
											<ProductForm
												form={productForm}
												categories={
													categories
												}
												editingId={
													editingProductId
												}
												saving={saving}
												onChange={
													updateProductField
												}
												onSubmit={
													saveProduct
												}
												onCancel={
													resetProductForm
												}
											/>
										</Modal>
									</div>
								)}

								{activeTab === "categories" && (
									<div className="admin-two-column admin-two-column--categories">
										<CategoryTable
											categories={categories}
											products={products}
											onEdit={editCategory}
											onDelete={deleteCategory}
											onAddClick={() =>
												setIsCategoryModalOpen(
													true,
												)
											}
										/>
										<Modal
											isOpen={
												isCategoryModalOpen
											}
											onClose={
												resetCategoryForm
											}
											title={
												editingCategoryId
													? "Edit Collection"
													: "Create Collection"
											}
											sizeClass="admin-modal-container--category"
										>
											<CategoryForm
												form={categoryForm}
												editingId={
													editingCategoryId
												}
												saving={saving}
												onChange={
													updateCategoryField
												}
												onSubmit={
													saveCategory
												}
												onCancel={
													resetCategoryForm
												}
											/>
										</Modal>
									</div>
								)}

								{activeTab === "orders" && (
									<OrdersTable
										orders={orders}
										onStatusChange={
											updateOrderStatus
										}
									/>
								)}

								{resourceConfigs[activeTab] && (
									<ResourceManager
										configKey={activeTab}
										config={
											resourceConfigs[
												activeTab
											]
										}
										items={
											resources[activeTab] ||
											[]
										}
										context={context}
										fetchJson={fetchJson}
										authHeaders={authHeaders}
										onChanged={loadAdminData}
										setNotice={setNotice}
										setError={setError}
									/>
								)}

								{activeTab === "settings" && (
									<SettingsPanel
										settings={settings}
										fetchJson={fetchJson}
										authHeaders={authHeaders}
										onChanged={loadAdminData}
										setNotice={setNotice}
										setError={setError}
									/>
								)}

								{activeTab === "seo" && (
									<SeoPanel
										fetchJson={fetchJson}
										setError={setError}
									/>
								)}
							</>
						)}
					</section>
				</section>
			</main>
		</>
	);
}

function tabIcon(tab) {
	const map = {
		products: faBoxOpen,
		categories: faLayerGroup,
		orders: faReceipt,
		pages: faFileLines,
		posts: faFileLines,
		postCategories: faFolderTree,
		menus: faLayerGroup,
		contentTypes: faFolderTree,
		contentEntries: faFileLines,
		banners: faImage,
		coupons: faTag,
		notifications: faBullhorn,
		settings: faGear,
		seo: faMagnifyingGlassChart,
	};
	return map[tab] || faLayerGroup;
}

function tabLabel(tab) {
	return (
		resourceConfigs[tab]?.title ||
		{
			products: "Products",
			categories: "Collections",
			orders: "Orders",
			settings: "Settings",
			seo: "SEO",
		}[tab]
	);
}

function StatCard({ icon, label, value, tone }) {
	return (
		<article
			className={`admin-stat-card ${tone === "warn" ? "admin-stat-card--warn" : ""}`}
		>
			<div className="admin-stat-icon">
				<FontAwesomeIcon icon={icon} />
			</div>
			<div>
				<p>{label}</p>
				<strong>{value}</strong>
			</div>
		</article>
	);
}

function ImageUploadField({ label, value, onChange, required }) {
	const [uploading, setUploading] = useState(false);

	const handleFile = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			const result = await uploadToCloudinary(file, imageFolder);
			onChange(result.url);
		} finally {
			setUploading(false);
			event.target.value = "";
		}
	};

	return (
		<label className="admin-image-field">
			{label}
			<div className="admin-image-control">
				{value ? (
					<img src={value} alt="" />
				) : (
					<div className="admin-image-empty">
						<FontAwesomeIcon icon={faImage} />
					</div>
				)}
				<div>
					<input
						value={value || ""}
						onChange={(event) => onChange(event.target.value)}
						required={required}
					/>
					<span className="admin-upload-button">
						<FontAwesomeIcon icon={faUpload} />{" "}
						{uploading
							? "Uploading..."
							: "Upload to Cloudinary"}
						<input
							type="file"
							accept="image/*,video/*"
							onChange={handleFile}
							disabled={uploading}
						/>
					</span>
				</div>
			</div>
		</label>
	);
}

function ProductForm({
	form,
	categories,
	editingId,
	saving,
	onChange,
	onSubmit,
	onCancel,
}) {
	return (
		<form className="admin-panel-card admin-form" onSubmit={onSubmit}>
			<div className="admin-card-header">
				<p>{editingId ? "Edit Product" : "Create Product"}</p>
				{editingId && (
					<button type="button" onClick={onCancel}>
						Clear
					</button>
				)}
			</div>
			<label>
				Product Name
				<input
					value={form.name}
					onChange={(event) =>
						onChange("name", event.target.value)
					}
					required
				/>
			</label>
			<div className="admin-form-grid">
				<label>
					Type
					<input
						value={form.type}
						onChange={(event) =>
							onChange("type", event.target.value)
						}
					/>
				</label>
				<label>
					Badge
					<input
						value={form.badge}
						onChange={(event) =>
							onChange("badge", event.target.value)
						}
						placeholder="Limited"
					/>
				</label>
			</div>
			<label>
				Collection
				<select
					value={form.category}
					onChange={(event) =>
						onChange("category", event.target.value)
					}
				>
					<option value="">No collection</option>
					{categories.map((category) => (
						<option key={category._id} value={category._id}>
							{category.name}
						</option>
					))}
				</select>
			</label>
			<div className="admin-form-grid">
				<label>
					Price
					<input
						type="number"
						min="0"
						value={form.price}
						onChange={(event) =>
							onChange("price", event.target.value)
						}
						required
					/>
				</label>
				<label>
					Stock
					<input
						type="number"
						min="0"
						value={form.stock}
						onChange={(event) =>
							onChange("stock", event.target.value)
						}
					/>
				</label>
			</div>
			<div className="admin-form-grid">
				<label>
					Slug
					<input
						value={form.slug}
						onChange={(event) =>
							onChange("slug", event.target.value)
						}
						required
					/>
				</label>
				<label>
					SKU
					<input
						value={form.sku}
						onChange={(event) =>
							onChange("sku", event.target.value)
						}
					/>
				</label>
			</div>
			<ImageUploadField
				label="Product Image"
				value={form.image}
				onChange={(value) => onChange("image", value)}
			/>
			<label>
				Description
				<textarea
					value={form.description}
					onChange={(event) =>
						onChange("description", event.target.value)
					}
					rows="4"
				/>
			</label>
			<div className="admin-form-grid">
				<label>
					Status
					<select
						value={form.status}
						onChange={(event) =>
							onChange("status", event.target.value)
						}
					>
						<option value="active">Active</option>
						<option value="draft">Draft</option>
					</select>
				</label>
				<label className="admin-check">
					<input
						type="checkbox"
						checked={form.isFeatured}
						onChange={(event) =>
							onChange("isFeatured", event.target.checked)
						}
					/>
					Featured
				</label>
			</div>
			<button
				type="submit"
				className="admin-primary-action"
				disabled={saving}
			>
				{saving
					? "Saving..."
					: editingId
						? "Update Product"
						: "Create Product"}
			</button>
		</form>
	);
}

function ProductTable({
	products,
	categoryById,
	onEdit,
	onDelete,
	onAddClick,
}) {
	return (
		<div className="admin-panel-card admin-table-card">
			<div className="admin-card-header">
				<p>Catalog ({products.length} products)</p>
				<button
					type="button"
					className="admin-primary-action"
					style={{ minHeight: "34px", padding: "0 14px" }}
					onClick={onAddClick}
				>
					<FontAwesomeIcon icon={faPlus} /> Add Product
				</button>
			</div>
			<div className="admin-table-scroll">
				<table className="admin-table">
					<thead>
						<tr>
							<th>Product</th>
							<th>Collection</th>
							<th>Price</th>
							<th>Stock</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => {
							const categoryId =
								typeof product.category === "object"
									? product.category?._id
									: product.category;
							const category =
								typeof product.category === "object"
									? product.category
									: categoryById[categoryId];
							return (
								<tr key={product._id}>
									<td>
										<div className="admin-product-cell">
											<img
												src={
													product.image ||
													product
														.images?.[0]
														?.url
												}
												alt={
													product.name ||
													product.title
												}
											/>
											<div>
												<strong>
													{product.name ||
														product.title}
												</strong>
												<span>
													{product.type ||
														product.slug}
												</span>
											</div>
										</div>
									</td>
									<td>
										{category?.name ||
											"Unassigned"}
									</td>
									<td>
										{formatMoney(product.price)}
									</td>
									<td>
										<span
											className={
												Number(
													product.stock ||
														0,
												) <= 30
													? "admin-stock-low"
													: ""
											}
										>
											{product.stock ?? 0}
										</span>
									</td>
									<td>
										<StatusPill
											value={product.status}
										/>
									</td>
									<td>
										<RowActions
											onEdit={() =>
												onEdit(product)
											}
											onDelete={() =>
												onDelete(product)
											}
										/>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function CategoryForm({
	form,
	editingId,
	saving,
	onChange,
	onSubmit,
	onCancel,
}) {
	return (
		<form className="admin-panel-card admin-form" onSubmit={onSubmit}>
			<div className="admin-card-header">
				<p>{editingId ? "Edit Collection" : "Create Collection"}</p>
				{editingId && (
					<button type="button" onClick={onCancel}>
						Clear
					</button>
				)}
			</div>
			<label>
				Collection Name
				<input
					value={form.name}
					onChange={(event) =>
						onChange("name", event.target.value)
					}
					required
				/>
			</label>
			<label>
				Slug
				<input
					value={form.slug}
					onChange={(event) =>
						onChange("slug", event.target.value)
					}
					required
				/>
			</label>
			<label>
				Description
				<textarea
					value={form.description}
					onChange={(event) =>
						onChange("description", event.target.value)
					}
					rows="5"
				/>
			</label>
			<div className="admin-form-grid">
				<label>
					Status
					<select
						value={form.status}
						onChange={(event) =>
							onChange("status", event.target.value)
						}
					>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</label>
				<label className="admin-check">
					<input
						type="checkbox"
						checked={form.isFeatured}
						onChange={(event) =>
							onChange("isFeatured", event.target.checked)
						}
					/>
					Featured
				</label>
			</div>
			<button
				type="submit"
				className="admin-primary-action"
				disabled={saving}
			>
				{saving
					? "Saving..."
					: editingId
						? "Update Collection"
						: "Create Collection"}
			</button>
		</form>
	);
}

function CategoryTable({ categories, products, onEdit, onDelete, onAddClick }) {
	const productCount = (id) =>
		products.filter(
			(product) =>
				(typeof product.category === "object"
					? product.category?._id
					: product.category) === id,
		).length;
	return (
		<div className="admin-panel-card admin-table-card">
			<div className="admin-card-header">
				<p>Collections ({categories.length} collections)</p>
				<button
					type="button"
					className="admin-primary-action"
					style={{ minHeight: "34px", padding: "0 14px" }}
					onClick={onAddClick}
				>
					<FontAwesomeIcon icon={faPlus} /> Add Collection
				</button>
			</div>
			<div className="admin-table-scroll">
				<table className="admin-table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Slug</th>
							<th>Products</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{categories.map((category) => (
							<tr key={category._id}>
								<td>
									<strong>{category.name}</strong>
								</td>
								<td>{category.slug}</td>
								<td>{productCount(category._id)}</td>
								<td>
									<StatusPill
										value={category.status}
									/>
								</td>
								<td>
									<RowActions
										onEdit={() =>
											onEdit(category)
										}
										onDelete={() =>
											onDelete(category)
										}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function OrdersTable({ orders, onStatusChange }) {
	return (
		<div className="admin-panel-card admin-table-card">
			<div className="admin-card-header">
				<p>Orders</p>
				<span>{orders.length} orders</span>
			</div>
			<div className="admin-table-scroll">
				<table className="admin-table">
					<thead>
						<tr>
							<th>Order</th>
							<th>Customer</th>
							<th>Items</th>
							<th>Total</th>
							<th>Payment</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr key={order._id}>
								<td>
									<strong>
										#
										{String(order._id)
											.slice(-6)
											.toUpperCase()}
									</strong>
									<span className="admin-muted">
										{new Date(
											order.createdAt,
										).toLocaleDateString()}
									</span>
								</td>
								<td>
									<strong>
										{[
											order.user?.firstName,
											order.user?.lastName,
										]
											.filter(Boolean)
											.join(" ") || "Customer"}
									</strong>
									<span className="admin-muted">
										{order.user?.email ||
											"No email"}
									</span>
								</td>
								<td>{order.items?.length || 0}</td>
								<td>
									{formatMoney(order.totalAmount)}
								</td>
								<td>
									<StatusPill
										value={
											order.paymentStatus ||
											order.paymentMethod
										}
									/>
								</td>
								<td>
									<select
										className="admin-status-select"
										value={
											order.orderStatus ||
											"pending"
										}
										onChange={(event) =>
											onStatusChange(
												order._id,
												event.target.value,
											)
										}
									>
										{[
											"pending",
											"confirmed",
											"processing",
											"shipped",
											"delivered",
											"cancelled",
										].map((status) => (
											<option
												key={status}
												value={status}
											>
												{status}
											</option>
										))}
									</select>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function ResourceManager({
	configKey,
	config,
	items,
	context,
	fetchJson,
	authHeaders,
	onChanged,
	setNotice,
	setError,
}) {
	const [form, setForm] = useState(config.empty);
	const [editingId, setEditingId] = useState(null);
	const [saving, setSaving] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		setForm(config.empty);
		setEditingId(null);
		setIsModalOpen(false);
	}, [configKey, config.empty]);

	const resetForm = () => {
		setEditingId(null);
		setForm(config.empty);
		setIsModalOpen(false);
	};

	const update = (field, value, meta = {}) => {
		setForm((current) => ({
			...current,
			[field]: value,
			...(meta.autoSlug && !editingId ? { slug: slugify(value) } : {}),
		}));
	};

	const edit = (item) => {
		setEditingId(item._id);
		setForm(
			Object.keys(config.empty).reduce((acc, key) => {
				acc[key] = normalizeForForm(item[key]);
				return acc;
			}, {}),
		);
		setIsModalOpen(true);
	};

	const save = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError("");
		try {
			const payload = normalizePayload(form, config);
			await fetchJson(
				editingId ? `${config.path}/${editingId}` : config.path,
				{
					method: editingId ? "PUT" : "POST",
					headers: authHeaders,
					body: JSON.stringify(payload),
				},
			);
			setNotice(
				editingId
					? `${config.title} item updated.`
					: `${config.title} item created.`,
			);
			resetForm();
			await onChanged();
		} catch (err) {
			setError(err.message);
		} finally {
			setSaving(false);
		}
	};

	const remove = async (item) => {
		if (
			!window.confirm(
				`Delete ${item.title || item.name || item.code || item._id}?`,
			)
		)
			return;
		setError("");
		try {
			await fetchJson(`${config.path}/${item._id}`, {
				method: "DELETE",
				headers: authHeaders,
			});
			setNotice(`${config.title} item deleted.`);
			await onChanged();
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div className="admin-two-column">
			<ResourceTable
				config={config}
				items={items}
				context={context}
				onEdit={edit}
				onDelete={remove}
				onAddClick={() => {
					setEditingId(null);
					setForm(config.empty);
					setIsModalOpen(true);
				}}
			/>
			<Modal
				isOpen={isModalOpen}
				onClose={resetForm}
				title={
					editingId
						? `Edit ${config.title}`
						: `Create ${config.title}`
				}
				sizeClass="admin-modal-container--resource"
			>
				<form
					className="admin-panel-card admin-form"
					onSubmit={save}
				>
					<div className="admin-dynamic-form">
						{config.fields.map(
							([name, label, type, meta = {}]) => (
								<DynamicField
									key={name}
									name={name}
									label={label}
									type={type}
									meta={meta}
									value={form[name]}
									context={context}
									onChange={(value) =>
										update(name, value, meta)
									}
								/>
							),
						)}
					</div>
					<button
						type="submit"
						className="admin-primary-action"
						disabled={saving}
					>
						{saving
							? "Saving..."
							: editingId
								? "Update"
								: "Create"}
					</button>
				</form>
			</Modal>
		</div>
	);
}

function DynamicField({ label, type, meta, value, context, onChange }) {
	if (type === "image") {
		return (
			<ImageUploadField
				label={label}
				value={value}
				onChange={onChange}
				required={meta.required}
			/>
		);
	}
	if (type === "select") {
		return (
			<label className={meta.wide ? "admin-field-wide" : ""}>
				{label}
				<select
					value={value || ""}
					onChange={(event) => onChange(event.target.value)}
					required={meta.required}
				>
					{meta.options.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			</label>
		);
	}
	if (type === "postCategory") {
		return (
			<label>
				{label}
				<select
					value={value || ""}
					onChange={(event) => onChange(event.target.value)}
				>
					<option value="">No category</option>
					{context.postCategories.map((item) => (
						<option key={item._id} value={item._id}>
							{item.name}
						</option>
					))}
				</select>
			</label>
		);
	}
	if (type === "contentType") {
		return (
			<label>
				{label}
				<select
					value={value || ""}
					onChange={(event) => onChange(event.target.value)}
					required={meta.required}
				>
					<option value="">Choose type</option>
					{context.contentTypes.map((item) => (
						<option key={item._id} value={item._id}>
							{item.name}
						</option>
					))}
				</select>
			</label>
		);
	}
	if (type === "textarea" || type === "json" || type === "tags") {
		return (
			<label className={meta.wide ? "admin-field-wide" : ""}>
				{label}
				<textarea
					value={value || ""}
					onChange={(event) => onChange(event.target.value)}
					rows={type === "json" ? 7 : 4}
					required={meta.required}
					placeholder={meta.hint || ""}
				/>
			</label>
		);
	}
	return (
		<label>
			{label}
			<input
				type={type}
				value={value || ""}
				onChange={(event) => onChange(event.target.value)}
				required={meta.required}
			/>
		</label>
	);
}

function ResourceTable({
	config,
	items,
	context,
	onEdit,
	onDelete,
	onAddClick,
}) {
	const display = (item, column) => {
		const value = item[column];
		if (column === "contentType") {
			return (
				value?.name ||
				context.contentTypes.find((type) => type._id === value)
					?.name ||
				"Untyped"
			);
		}
		if (value && typeof value === "object")
			return value.name || value.title || value._id;
		if (Array.isArray(value)) return value.join(", ");
		return value ?? "-";
	};

	return (
		<div className="admin-panel-card admin-table-card">
			<div className="admin-card-header">
				<p>
					{config.title} ({items.length} records)
				</p>
				<button
					type="button"
					className="admin-primary-action"
					style={{ minHeight: "34px", padding: "0 14px" }}
					onClick={onAddClick}
				>
					<FontAwesomeIcon icon={faPlus} /> Add Entry
				</button>
			</div>
			<div className="admin-table-scroll">
				<table className="admin-table">
					<thead>
						<tr>
							{config.columns.map((column) => (
								<th key={column}>{column}</th>
							))}
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item) => (
							<tr key={item._id}>
								{config.columns.map((column) => (
									<td key={column}>
										{column === "status" ? (
											<StatusPill
												value={display(
													item,
													column,
												)}
											/>
										) : (
											<strong>
												{display(
													item,
													column,
												)}
											</strong>
										)}
									</td>
								))}
								<td>
									<RowActions
										onEdit={() => onEdit(item)}
										onDelete={() =>
											onDelete(item)
										}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function SettingsPanel({
	settings,
	fetchJson,
	authHeaders,
	onChanged,
	setNotice,
	setError,
}) {
	const [form, setForm] = useState({
		siteName: "",
		siteDescription: "",
		logo: "",
		favicon: "",
		contactEmail: "",
		contactPhone: "",
		address: "",
		facebook: "",
		instagram: "",
		twitter: "",
		linkedin: "",
		youtube: "",
	});

	useEffect(() => {
		setForm({
			siteName: settings.siteName || "",
			siteDescription: settings.siteDescription || "",
			logo: settings.logo || "",
			favicon: settings.favicon || "",
			contactEmail: settings.contactEmail || "",
			contactPhone: settings.contactPhone || "",
			address: settings.address || "",
			facebook: settings.socialLinks?.facebook || "",
			instagram: settings.socialLinks?.instagram || "",
			twitter: settings.socialLinks?.twitter || "",
			linkedin: settings.socialLinks?.linkedin || "",
			youtube: settings.socialLinks?.youtube || "",
		});
	}, [settings]);

	const update = (field, value) =>
		setForm((current) => ({ ...current, [field]: value }));

	const save = async (event) => {
		event.preventDefault();
		setError("");
		try {
			const socialLinks = {
				facebook: form.facebook,
				instagram: form.instagram,
				twitter: form.twitter,
				linkedin: form.linkedin,
				youtube: form.youtube,
			};
			const cleanSocialLinks = Object.fromEntries(
				Object.entries(socialLinks).filter(([, value]) => value),
			);
			const payload = {
				siteName: form.siteName || undefined,
				siteDescription: form.siteDescription || undefined,
				logo: form.logo || undefined,
				favicon: form.favicon || undefined,
				contactEmail: form.contactEmail || undefined,
				contactPhone: form.contactPhone || undefined,
				address: form.address || undefined,
				...(Object.keys(cleanSocialLinks).length
					? { socialLinks: cleanSocialLinks }
					: {}),
			};

			await fetchJson("/settings", {
				method: "PUT",
				headers: authHeaders,
				body: JSON.stringify(payload),
			});
			setNotice("Settings updated.");
			await onChanged();
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<form
			className="admin-panel-card admin-form admin-settings-form"
			onSubmit={save}
		>
			<div className="admin-card-header">
				<p>Site Settings</p>
				<span>Global configuration</span>
			</div>
			<div className="admin-form-grid">
				<label>
					Site Name
					<input
						value={form.siteName}
						onChange={(event) =>
							update("siteName", event.target.value)
						}
					/>
				</label>
				<label>
					Contact Email
					<input
						value={form.contactEmail}
						onChange={(event) =>
							update("contactEmail", event.target.value)
						}
					/>
				</label>
			</div>
			<label>
				Site Description
				<textarea
					value={form.siteDescription}
					onChange={(event) =>
						update("siteDescription", event.target.value)
					}
					rows="3"
				/>
			</label>
			<ImageUploadField
				label="Logo"
				value={form.logo}
				onChange={(value) => update("logo", value)}
			/>
			<ImageUploadField
				label="Favicon"
				value={form.favicon}
				onChange={(value) => update("favicon", value)}
			/>
			<div className="admin-form-grid">
				<label>
					Phone
					<input
						value={form.contactPhone}
						onChange={(event) =>
							update("contactPhone", event.target.value)
						}
					/>
				</label>
				<label>
					Address
					<input
						value={form.address}
						onChange={(event) =>
							update("address", event.target.value)
						}
					/>
				</label>
			</div>
			<div className="admin-form-grid">
				{[
					"facebook",
					"instagram",
					"twitter",
					"linkedin",
					"youtube",
				].map((field) => (
					<label key={field}>
						{field}
						<input
							value={form[field]}
							onChange={(event) =>
								update(field, event.target.value)
							}
						/>
					</label>
				))}
			</div>
			<button type="submit" className="admin-primary-action">
				Save Settings
			</button>
		</form>
	);
}

function SeoPanel({ fetchJson, setError }) {
	const [query, setQuery] = useState({ type: "page", slug: "" });
	const [meta, setMeta] = useState(null);

	const lookup = async (event) => {
		event.preventDefault();
		setError("");
		setMeta(null);
		try {
			const data = await fetchJson(
				`/seo/meta?type=${encodeURIComponent(query.type)}&slug=${encodeURIComponent(query.slug)}`,
			);
			setMeta(data.data || data);
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div className="admin-two-column admin-two-column--categories">
			<form className="admin-panel-card admin-form" onSubmit={lookup}>
				<div className="admin-card-header">
					<p>SEO Lookup</p>
					<span>Backend SEO routes</span>
				</div>
				<label>
					Type
					<select
						value={query.type}
						onChange={(event) =>
							setQuery((current) => ({
								...current,
								type: event.target.value,
							}))
						}
					>
						<option value="page">page</option>
						<option value="post">post</option>
						<option value="product">product</option>
					</select>
				</label>
				<label>
					Slug
					<input
						value={query.slug}
						onChange={(event) =>
							setQuery((current) => ({
								...current,
								slug: event.target.value,
							}))
						}
						required
					/>
				</label>
				<button type="submit" className="admin-primary-action">
					Fetch Meta
				</button>
			</form>
			<div className="admin-panel-card admin-seo-card">
				<div className="admin-card-header">
					<p>SEO Utilities</p>
					<span>Read-only endpoints</span>
				</div>
				<a
					href={`${API_BASE_URL}/seo/sitemap.xml`}
					target="_blank"
					rel="noreferrer"
				>
					Open sitemap.xml
				</a>
				<a
					href={`${API_BASE_URL}/seo/robots.txt`}
					target="_blank"
					rel="noreferrer"
				>
					Open robots.txt
				</a>
				<pre>
					{meta
						? JSON.stringify(meta, null, 2)
						: "SEO meta results appear here."}
				</pre>
			</div>
		</div>
	);
}

function RowActions({ onEdit, onDelete }) {
	return (
		<div className="admin-row-actions">
			<button type="button" onClick={onEdit} aria-label="Edit">
				<FontAwesomeIcon icon={faPen} />
			</button>
			<button type="button" onClick={onDelete} aria-label="Delete">
				<FontAwesomeIcon icon={faTrash} />
			</button>
		</div>
	);
}

function StatusPill({ value }) {
	return (
		<span
			className={`admin-status-pill admin-status-pill--${value || "unknown"}`}
		>
			{value || "unknown"}
		</span>
	);
}

function Modal({ isOpen, onClose, title, sizeClass, children }) {
	return (
		<div
			className={`admin-modal-overlay ${isOpen ? "admin-modal-overlay--open" : ""}`}
			onClick={onClose}
		>
			<div
				className={`admin-modal-container ${sizeClass}`}
				onClick={(e) => e.stopPropagation()}
			>
				<header className="admin-modal-header">
					<h3>{title}</h3>
					<button
						type="button"
						className="admin-modal-close-btn"
						onClick={onClose}
						aria-label="Close"
					>
						<FontAwesomeIcon icon={faXmark} />
					</button>
				</header>
				<div className="admin-modal-body">{children}</div>
			</div>
		</div>
	);
}
