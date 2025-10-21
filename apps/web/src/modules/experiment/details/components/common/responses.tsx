import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@parametric-ai/ui/components/tabs";
import { ResponseList } from "./response-list";

export const Responses = () => (
  <Tabs className="h-full flex-1" defaultValue="list">
    <TabsList className="self-end">
      <TabsTrigger value="list">List</TabsTrigger>
      <TabsTrigger value="charts">Charts</TabsTrigger>
    </TabsList>
    <TabsContent value="list">
      <ResponseList />
    </TabsContent>
    <TabsContent value="charts">Charts</TabsContent>
  </Tabs>
);
