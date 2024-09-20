import { SocialDashboard } from "./social-dashboard";

export default function SocialPage() {
  const defaultLayout = undefined;
  const defaultCollapsed = undefined;

  return (
    <>
      <div className="flex-col md:flex h-screen">
        <SocialDashboard
          defaultCollapsed={defaultCollapsed}
          defaultLayout={defaultLayout}
          navCollapsedSize={4}
        />
      </div>
    </>
  );
}
