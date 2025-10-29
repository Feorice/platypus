import { createFileRoute } from '@tanstack/react-router';
import Atmosphere from '@/components/Atmosphere';

export const Route = createFileRoute('/home')({
	component: RouteComponent,
});

function RouteComponent() {
	return <Atmosphere />;
}
