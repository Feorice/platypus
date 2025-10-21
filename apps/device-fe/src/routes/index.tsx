import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { Suspense, use, useState, useTransition } from "react";

type ImageData = {
	id: number;
	url: string;
	title: string;
};

export const Route = createFileRoute("/")({
	ssr: false,
	component: App,
});

const fetchImage = async (id: number): Promise<ImageData> => {
	// biome-ignore lint/suspicious/noExplicitAny: Don't care if any type here
	await new Promise((r: any) => setTimeout(r, 800));
	return { id, url: `/images/${id}.jpg`, title: `Image ${id}` };
};

const Button = ({
	action,
	children,
}: {
	action: () => void;
	children: React.ReactNode;
}) => {
  const [isPending, startTransition] = useTransition();

	return (
		<button
    disabled={isPending}
			onClick={() => {
        startTransition(() => {
          action();
        })
      }}
			type="button"
			className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-bold text-2xl disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
		>
			{children}
		</button>
	);
};

const Image = ({
	imageDataPromise,
}: {
	imageDataPromise: Promise<ImageData>;
}) => {
	const image = use(imageDataPromise);

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
};

const ImageSkeleton = () => {
	return (
		<div className="mt-5">
			<h2 className="text-2xl font-bold mb-4">Loading...</h2>
			<div className="h-96 aspect-5/4 bg-gray-300 animate-pulse rounded-md"></div>
		</div>
	);
};

function App() {
	const [imageId, setImageId] = useState(1);
	const [imageDataPromise, setImageDataPromise] = useState<Promise<ImageData>>(
		() => fetchImage(imageId),
	);

	return (
		<div className="flex flex-col justify-center items-center bg-blue-950 text-white p-4 h-screen">
			<Button
				action={() => {
					const nextImageId = imageId + 1;
					setImageId(nextImageId);
					setImageDataPromise(fetchImage(nextImageId));
				}}
			>
				Next Image
			</Button>
			<Suspense fallback={<ImageSkeleton />}>
				<Image imageDataPromise={imageDataPromise} />
			</Suspense>
		</div>
	);
}
