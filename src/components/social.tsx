import { accounts, socialPosts } from "../data";
import { SocialDashboard } from "./social-dashboard";

export default function SocialPage() {
  const defaultLayout = undefined;
  const defaultCollapsed = undefined;

  return (
    <>
      {/* <div className="md:hidden">
        <img
          alt="Social Dashboard"
          className="hidden dark:block"
          height={727}
          src="/examples/mail-dark.png"
          width={1280}
        />
        <img
          alt="Social Dashboard"
          className="block dark:hidden"
          height={727}
          src="/examples/mail-light.png"
          width={1280}
        />
      </div> */}
      <div className="flex-col md:flex h-screen">
        <SocialDashboard
          accounts={accounts}
          defaultCollapsed={defaultCollapsed}
          defaultLayout={defaultLayout}
          navCollapsedSize={4}
          socialPosts={socialPosts}
        />
      </div>
    </>
  );
}
