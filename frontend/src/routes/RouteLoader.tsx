import { Suspense } from "react";
import SuspenseLoader from "../components/SuspenseLoader";

const RouteLoader = (Component: React.ElementType) => (props: any) => (
    <Suspense fallback={<SuspenseLoader />}>
        <Component {...props} />
    </Suspense>
);

export default RouteLoader;