import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@parametric-ai/ui/components/tabs";
import { ResponseCharts } from "./response-charts";
import { ResponseList } from "./response-list";

export const Responses = () => (
  <Tabs className="h-full flex-1 gap-4 md:gap-2" defaultValue="list">
    <TabsList className="w-full md:w-fit md:self-end">
      <TabsTrigger value="list">List</TabsTrigger>
      <TabsTrigger value="charts">Charts</TabsTrigger>
    </TabsList>
    <TabsContent value="list">
      <ResponseList />
    </TabsContent>
    <TabsContent value="charts">
      <ResponseCharts />
    </TabsContent>
  </Tabs>
);
