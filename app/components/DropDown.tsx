import { StyleSheet, Text, View } from "react-native";
import React from "react";
import * as DropDownMenu from "zeego/dropdown-menu";
import RoundButton from "./RoundButton";
const DropDown = () => {
  return (
    <DropDownMenu.Root>
      <DropDownMenu.Trigger>
        <RoundButton icon={"ellipsis-horizontal"} text="More" />
      </DropDownMenu.Trigger>
      <DropDownMenu.Content>
        <DropDownMenu.Item key="statement">
          <DropDownMenu.ItemTitle>Statement</DropDownMenu.ItemTitle>
          <DropDownMenu.ItemIcon androidIconName="ic_menu_info_details" />
        </DropDownMenu.Item>
        <DropDownMenu.Item key="converter">
          <DropDownMenu.ItemTitle>Converter</DropDownMenu.ItemTitle>
          <DropDownMenu.ItemIcon androidIconName="ic_menu_compass" />
        </DropDownMenu.Item>
        <DropDownMenu.Item key="background">
          <DropDownMenu.ItemTitle>Background</DropDownMenu.ItemTitle>
          <DropDownMenu.ItemIcon androidIconName="ic_menu_camera" />
        </DropDownMenu.Item>
      </DropDownMenu.Content>
    </DropDownMenu.Root>
  );
};

export default DropDown;

const styles = StyleSheet.create({});
