"use client";

import React, { useEffect, useState, useCallback } from "react";
import "@xyflow/react/dist/style.css";
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from "@xyflow/react";
import { useTheme } from "../context/ThemeContext";
import styles from "./page.module.css";

interface Lesson {
  id: string;
  title: string;
  prerequisites: string[];
  ignore: boolean;
}

interface ExploreLessonsProps {
  lessons: Lesson[];
}

const ExploreLessons: React.FC<ExploreLessonsProps> = ({ lessons }) => {
  const { isDarkMode } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  useEffect(() => {
    const levels: Record<string, number> = {};
    const positions: Record<string, { x: number; y: number }> = {};

    const getLevel = (lesson: Lesson): number => {
      if (lesson.prerequisites.length === 0) return 0;
      return Math.max(...lesson.prerequisites.map((prereq) => levels[prereq] || 0)) + 1;
    };

    lessons = lessons.filter(lesson => lesson.ignore != true);

    lessons.forEach((lesson) => {
      levels[lesson.id] = getLevel(lesson);
    });

    const levelsArray: Record<number, Lesson[]> = {};
    lessons.forEach((lesson) => {
      const level = levels[lesson.id];
      if (!levelsArray[level]) levelsArray[level] = [];
      levelsArray[level].push(lesson);
    });

    Object.entries(levelsArray).forEach(([level, levelLessons]) => {
      const levelIndex = parseInt(level);
      const totalWidth = levelLessons.length * 250;
      levelLessons.forEach((lesson, i) => {
        positions[lesson.id] = {
          x: (i * 250) - totalWidth / 2,
          y: levelIndex * 150,
        };
      });
    });

    setNodes(
      lessons.map((lesson) => ({
        id: lesson.id,
        data: { label: lesson.title },
        position: positions[lesson.id],
        style: {
          backgroundColor: isDarkMode ? "#292d3e" : "#f3f4f6",
          color: isDarkMode ? "#e6edf3" : "#1e293b",
          padding: "15px",
          borderRadius: "10px",
          textAlign: "center",
          fontWeight: "bold",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          border: "2px solid #6366f1",
          width: "200px",
        },
        sourcePosition: "bottom",
        targetPosition: lesson.prerequisites.length > 0 ? "top" : undefined,
      }))
    );

    setEdges(
      lessons.flatMap((lesson) =>
        lesson.prerequisites.map((prereq) => ({
          id: `${prereq}-${lesson.id}`,
          source: prereq,
          target: lesson.id,
          animated: true,
          style: { stroke: "#6366F1", strokeWidth: 3 },
        }))
      )
    );

    setLoading(false);
  }, [isDarkMode, lessons]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedLesson(node.id);
  }, []);

  return (
    <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ""}`}>
      <ReactFlowProvider>
        {!loading && nodes.length > 0 && edges.length > 0 ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodesConnectable={false}
            fitView
            className={styles.reactFlow}
            proOptions={{ hideAttribution: true }}
          >
            <Controls showZoom={false} showInteractive={false} showFitView={false} />
          </ReactFlow>
        ) : (
          <p className={styles.loadingText}>Loading lessons...</p>
        )}
      </ReactFlowProvider>
      {selectedLesson && (
        <div className={styles.modal} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.75)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div className={styles.modalContent} style={{ position: "relative", width: "90%", height: "90%", borderRadius: "10px", overflow: "hidden", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}>
            <button className={styles.closeButton} onClick={() => setSelectedLesson(null)} style={{ position: "absolute", top: "15px", left: "15px", background: isDarkMode ? "#6366F1" : "#EF4444", color: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold", cursor: "pointer" }}>×</button>
            <iframe
              src={`/lessons/${selectedLesson}`}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Lesson"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreLessons;
