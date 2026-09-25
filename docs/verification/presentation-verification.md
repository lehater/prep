# Presentation Verification

## Purpose

Define evidence needed after Presentation System and Screen/View Design are accepted.

## Current executable checks

For the current experiment, every view required by canonical Interface Topology must have a stable subject id in the existing canonical `docs/interface/screen-view-design.md`. The project integration adapter extracts those ids and the generic Harness topology→screen subject evaluator compares them with the topology-derived expected set.

This is structural evidence only. It does not prove usability, accessibility, visual correctness or the value of the 3D graph. Those require separate rendered/task evidence when the frontend prototype exists.
