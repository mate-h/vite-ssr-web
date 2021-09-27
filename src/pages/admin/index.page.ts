import { PageProps } from "lib/types";
import { Layout } from "./_layout";

export { Page };

function Page(pageProps:  PageProps) {
  return Layout({pageProps, children: /*html*/`
<div class="py-6">
  <div class="px-4 sm:px-6 md:px-0">
    <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
  </div>
  <div class="px-4 sm:px-6 md:px-0">
    
    <!-- Replace with your content -->
    <div class="py-4">
      <div class="h-96 border-4 border-dashed border-gray-200 rounded-lg"></div>
    </div>
    <!-- /End replace -->
  </div>
</div>
  `});
}