import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

type ImageData = {
	id: number;
	url: string;
	title: string;
};

export const Route = createFileRoute("/tanstack-query")({
	ssr: false,
	component: App,
});

async function fetchImage(id: number): Promise<ImageData> {
	// biome-ignore lint/suspicious/noExplicitAny: Don't care about any type for this.
	await new Promise((r: any) => setTimeout(r, 800));
	return { id, url: `/images/${id}.jpg`, title: `Image ${id}` };
}

function App() {
	const [imageId, setImageId] = useState(1);
	const { data: imageData, isPending } = useQuery<ImageData>({
		queryKey: ["imageData", imageId],
		queryFn: () => fetchImage(imageId),
	});

	return (
		<div className="flex flex-col justify-center items-center bg-blue-950 text-white p-4 h-screen">
			<Button onClick={() => setImageId(imageId + 1)}>Next Image</Button>
			{imageData && !isPending && <Image image={imageData} />}
			{isPending && <ImageSkeleton />}
		</div>
	);
}

function Button({
	onClick,
	children,
}: {
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			onClick={onClick}
			type="button"
			className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-bold text-2xl"
		>
			{children}
		</button>
	);
}

function Image({
	image,
}: {
	image: { id: number; url: string; title: string };
}) {
	return (
		<div className="mt-5">
			<h2 className="text-2xl font-bold mb-4">{image.title}</h2>
			<img
				src={image.url}
				alt={image.title}
				className="h-96 object-contain aspect-5/4"
			/>
		</div>
	);
}

function ImageSkeleton() {
	return (
		<div className="mt-5">
			<h2 className="text-2xl font-bold mb-4">Loading...</h2>
			<div className="h-96 aspect-5/4 bg-gray-300 animate-pulse rounded-md"></div>
		</div>
	);
}
