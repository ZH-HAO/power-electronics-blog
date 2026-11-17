# 图论作业1

> 专栏：图论 · Notion 最后编辑：2026-11-11T11:15:00.000Z
>
> 来源：https://www.notion.so/1609d73858838206b18281a716138ee5

### 一、填空题

1．在同构意义下，具有 3 条边的 4 阶简单图的个数为（3）。

![](assets/graph-homework-1-40a9d738588380a19bb2d5cd3aa7b8c0.jpg)

2．若 $G$ 为 $n$ 阶 $k$ 正则图，则 $G$ 的补图的边数为（　$\frac{n(n-1-k)}{2}$　）。

> 
> 
> $$
> \because G是k阶正则图\\
> \therefore \forall v\in V(G),d(v)=k\\
> 由握手定理得：2m(G)=\sum_{i=1}^nd(v_i)=nk\\
> m(G)=\frac{nk}{2}\\
> m(K_n-G)=\mathrm{C}_n^2-m(G)=\frac{n(n-1)-nk}{2}=\frac{n(n-1-k)}{2}
> $$

3．完全图 $K_{3}$ 与超立方体 $Q_{3}$ 的积图的边数为（　60　）。

> 
> 
> $$
> 由完全图K_3与超立方体Q_3得：\\
> n_1=|V(K_3)|=3,m_1=|E(K_3)|=3\\
> n_2=|V(Q_3)|=8,m_2=|Q_3|=12\\
> m(K_3\times Q_3)=n_1m_2+m_1n_2=3\times12+3\times8=60
> $$

4．设简单图 $G$ 的邻接矩阵为 $A$，且

$$
A^{2}=\left(\begin{array}{lllll}
3 & 1 & 1 & 2 & 0 \\
1 & 2 & 1 & 1 & 1 \\
1 & 1 & 3 & 0 & 2 \\
2 & 1 & 0 & 2 & 0 \\
0 & 1 & 2 & 0 & 2
\end{array}\right),
$$

则图 $G$ 的边数为（　6　）。

> 
> 
> $$
> 由A^2推论：简单图G的邻接矩阵为A，A^2主对角线元素a_{ii}^{(2)}是对应顶点v_i的度数，\\即d(v_i)=a_{ii}^{(2)}\\ \therefore \sum_{v_i \in V(G)}d(v_i)=\sum{a_{ii}^{(2)}}=2m=3+2+3+2+2=12\\\therefore m=6
> $$

5．已知简单图 $G$ 的邻接矩阵为

$$
A=\left(\begin{array}{lllll}
0 & 1 & 1 & 0 & 1 \\
1 & 0 & 1 & 0 & 0 \\
1 & 1 & 0 & 1 & 0 \\
0 & 0 & 1 & 0 & 1 \\
1 & 0 & 0 & 1 & 0
\end{array}\right),
$$

则 $G$ 中长度为 2 的途径的数目为（　　）。

> 
> 
> $$
> A=\begin{pmatrix}
> 0&1&1&0&1\\
> 1&0&1&0&0\\
> 1&1&0&1&0\\
> 0&0&1&0&1\\
> 1&0&0&1&0
> \end{pmatrix}\\A^2=AA=\begin{pmatrix}
> 0&1&1&0&1\\
> 1&0&1&0&0\\
> 1&1&0&1&0\\
> 0&0&1&0&1\\
> 1&0&0&1&0
> \end{pmatrix}\begin{pmatrix}
> 0&1&1&0&1\\
> 1&0&1&0&0\\
> 1&1&0&1&0\\
> 0&0&1&0&1\\
> 1&0&0&1&0
> \end{pmatrix}=\begin{pmatrix}
> 3&1&1&2&0\\
> 1&2&1&1&1\\
> 1&1&3&0&2\\
> 2&1&0&2&0\\
> 0&1&2&0&2\\
> \end{pmatrix}\\
> \sum{a_{ij}^{(2)}}=7+6+7+5+5=30
> $$

6．下图中从 $S$ 到 $T$ 的最短路的长度为（　9　）。

![](assets/graph-homework-1-40a9d738588381bdb600fb3176f440e2.jpg)

7．设 $G$ 是 $n$ 阶简单图，且不含完全子图 $K_{3}$，则其边数一定不会超过（　　）。

> 由 Turán 定理，G 不含 K₃，故
> 
> $$
> m(G) \le m(T_2(n)).
> $$
> 
> 而 Turán 图 $T_2(n) = K_{\lfloor n/2 \rfloor,\ \lceil n/2 \rceil}$，所以
> 
> $$
> m(G) \le \left\lfloor \frac{n}{2} \right\rfloor \left\lceil \frac{n}{2} \right\rceil = \left\lfloor \frac{n^2}{4} \right\rfloor,
> $$
> 
> 等号成立当且仅当 $G \cong T_2(n) = K_{\lfloor n/2 \rfloor,\ \lceil n/2 \rceil}$。

8．设 $n$ 阶图 $G$ 是具有 $k$ 个分支的森林，则其边数为（　n-k　）。

> **推论** 假定 $(n, m)$ 图 $G$ 是由 $k$ 棵树组成的森林，则 $m=n-k$。

9．完全图 $K_{5}$ 的生成树的个数为（　125　）。

> **定理** $\tau\left(K_{n}\right)=n^{n-2}$，即 $n$ 阶标号树的个数为 $n^{n-2}$。
> 
> $$
> 5^{5-2}=5^3=125
> $$

10．下图的最小生成树的权重为（　18　）。

![](assets/graph-homework-1-40a9d73858838103be1ddc256c9e22b1.jpg)

**概念**：最小生成树（MST）= 连通加权图中，边权之和最小的生成树。

**图的结构**：12 个顶点、20 条边。

[https://prod-files-secure.s3.us-west-2.amazonaws.com/d8c9d738-5883-8170-a329-0003135dac6a/7eb503d7-3511-4bd5-a568-90a9bf57f1dc/%E7%AC%AC10%E9%A2%98-%E6%9C%80%E5%B0%8F%E7%94%9F%E6%88%90%E6%A0%91.html?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664WN6R45U%2F20261117%2Fus-west-2%2Fs3%2Faws4\_request&X-Amz-Date=20261117T101105Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIQCA9iIwgqwH7olxohRMpDeWxhv60oK%2BkwcPzR28%2BG5%2FlAIgYWYR7wUuwIyv7SGrUyH0fxNA5QSDwoaMhds0pgH4TDQqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIrRIk76B5ACsDJzeSrcA2U8hBwD75NJfcw%2BJZLvS3vaZ7aNb5a%2F%2FaHoEfEUO3Y74N%2FB2CEaQZA0Cj%2FDPZB82IA6Au03yGR%2BNoTz3%2F9pLkKKiwkD3nMCZDkUFRjwcfX3mwHtMLiemXDOud35MBEPLUTsJvSynaidKzCJFbpT3M6KqAH%2BLOq53crsXjxJX8UjAsS16aVul3Ur9DU3a84Xr2v586VIfQS4Jq6lvMLQmhd4LU%2FbIpuZmJY7%2Bl1VwdG0IeueQZSIJMDPcHXAE8ywXLj5CM2ZORsdRGoRuIXGnUEnlpyh7KPgeG28dHP6kRVbGRLUBXvc3EYRI4Y7ccg9p2lzTx4LFgsc7P6KW8SRSrP3ePZcEKKOhF7BPuoZQX9GO1EHFbwDrd9J8lnBOsnKMMaW21UCZj13Dd7hgX9K4Ygpu47mcmCq6PQ6pjnJeFp9zT1HhzQeqOOm9i%2BegeSUS3HXyrZRqrvL8RSoMCftJiJEk%2FMbK8ViWSyDw1uiPr%2F9ZM1o5ki66258%2BqKaJmkvxnUNkEQ8ngm7uwO71JWxNxqOdVSC14IEPZcet%2FPQQF4ewEr%2B8AdPMPY%2BZlRN8Y1BMUfuKouIG%2BHVfeyxUPNZlDqDGpo3VY2oR%2FXsWkEIMi49987IeRExExiwqwbDMMbN8NcGOqUBK217I3RepiV4EF5qeEVpEsyiszaWHuEi%2F%2BTYXAsOvqfvt7v8yLWfo9zO23OVgbTFt6SYtAwy6vRl0nmHz2mvbPn53J%2FMpHxESFOVljOU2eMVefnR4UlyM0acC0Lr%2FIEaP5peT0qgumr1jjCV1hjAnMkbVFJuU2PZIBuouVg3j4GlHCF30UYlqnw7OxzkkgE5m2xQRXE%2FmdHJ7iipBWJpaHISn8DX&X-Amz-Signature=4dcaf381f08799c2a788ff3f529fd4150d6dcae164cb7abcc2ccb0b6e1bd3c45&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject](<https://prod-files-secure.s3.us-west-2.amazonaws.com/d8c9d738-5883-8170-a329-0003135dac6a/7eb503d7-3511-4bd5-a568-90a9bf57f1dc/%E7%AC%AC10%E9%A2%98-%E6%9C%80%E5%B0%8F%E7%94%9F%E6%88%90%E6%A0%91.html?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664WN6R45U%2F20261117%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20261117T101105Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIQCA9iIwgqwH7olxohRMpDeWxhv60oK%2BkwcPzR28%2BG5%2FlAIgYWYR7wUuwIyv7SGrUyH0fxNA5QSDwoaMhds0pgH4TDQqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIrRIk76B5ACsDJzeSrcA2U8hBwD75NJfcw%2BJZLvS3vaZ7aNb5a%2F%2FaHoEfEUO3Y74N%2FB2CEaQZA0Cj%2FDPZB82IA6Au03yGR%2BNoTz3%2F9pLkKKiwkD3nMCZDkUFRjwcfX3mwHtMLiemXDOud35MBEPLUTsJvSynaidKzCJFbpT3M6KqAH%2BLOq53crsXjxJX8UjAsS16aVul3Ur9DU3a84Xr2v586VIfQS4Jq6lvMLQmhd4LU%2FbIpuZmJY7%2Bl1VwdG0IeueQZSIJMDPcHXAE8ywXLj5CM2ZORsdRGoRuIXGnUEnlpyh7KPgeG28dHP6kRVbGRLUBXvc3EYRI4Y7ccg9p2lzTx4LFgsc7P6KW8SRSrP3ePZcEKKOhF7BPuoZQX9GO1EHFbwDrd9J8lnBOsnKMMaW21UCZj13Dd7hgX9K4Ygpu47mcmCq6PQ6pjnJeFp9zT1HhzQeqOOm9i%2BegeSUS3HXyrZRqrvL8RSoMCftJiJEk%2FMbK8ViWSyDw1uiPr%2F9ZM1o5ki66258%2BqKaJmkvxnUNkEQ8ngm7uwO71JWxNxqOdVSC14IEPZcet%2FPQQF4ewEr%2B8AdPMPY%2BZlRN8Y1BMUfuKouIG%2BHVfeyxUPNZlDqDGpo3VY2oR%2FXsWkEIMi49987IeRExExiwqwbDMMbN8NcGOqUBK217I3RepiV4EF5qeEVpEsyiszaWHuEi%2F%2BTYXAsOvqfvt7v8yLWfo9zO23OVgbTFt6SYtAwy6vRl0nmHz2mvbPn53J%2FMpHxESFOVljOU2eMVefnR4UlyM0acC0Lr%2FIEaP5peT0qgumr1jjCV1hjAnMkbVFJuU2PZIBuouVg3j4GlHCF30UYlqnw7OxzkkgE5m2xQRXE%2FmdHJ7iipBWJpaHISn8DX&X-Amz-Signature=4dcaf381f08799c2a788ff3f529fd4150d6dcae164cb7abcc2ccb0b6e1bd3c45&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject>)

**Kruskal 算法**：按权值从小到大选边，不成圈就选，直到选够 11 条。

<table>
<tr><th>权值</th><th>边数</th><th>处理</th></tr>
<tr><td>1</td><td>6</td><td>全选</td></tr>
<tr><td>2</td><td>4</td><td>选 3 条（a-b、a-c、b-d）</td></tr>
<tr><td>3</td><td>4</td><td>选 2 条（l1-a、b-r1）</td></tr>
<tr><td>4</td><td>4</td><td>全跳过（成圈）</td></tr>
<tr><td>7</td><td>2</td><td>全跳过（成圈）</td></tr>
</table>

**结果**：

$$
6\times 1 + 3\times 2 + 2\times 3 = 18
$$

11．下图的直径为（　7　），所有中心点构成的集合为（　$\{e，u\}$　）。

![](assets/graph-homework-1-40a9d7385883815ca1c1ffa097ebceff.jpg)

**概念**：

- **距离** $d(u,v)$：$u$ 到 $v$ 的**最短**路径长度

- **直径**：所有点对距离的最大值

- **偏心率**：点到最远点的距离

- **中心**：偏心率最小的点集

**图的结构**：16 个顶点、17 条边。

[https://prod-files-secure.s3.us-west-2.amazonaws.com/d8c9d738-5883-8170-a329-0003135dac6a/831c36f8-4219-4feb-8223-e736e92a3a39/%E7%AC%AC11%E9%A2%98-%E7%9B%B4%E5%BE%84%E4%B8%8E%E4%B8%AD%E5%BF%83.html?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664WN6R45U%2F20261117%2Fus-west-2%2Fs3%2Faws4\_request&X-Amz-Date=20261117T101105Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIQCA9iIwgqwH7olxohRMpDeWxhv60oK%2BkwcPzR28%2BG5%2FlAIgYWYR7wUuwIyv7SGrUyH0fxNA5QSDwoaMhds0pgH4TDQqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIrRIk76B5ACsDJzeSrcA2U8hBwD75NJfcw%2BJZLvS3vaZ7aNb5a%2F%2FaHoEfEUO3Y74N%2FB2CEaQZA0Cj%2FDPZB82IA6Au03yGR%2BNoTz3%2F9pLkKKiwkD3nMCZDkUFRjwcfX3mwHtMLiemXDOud35MBEPLUTsJvSynaidKzCJFbpT3M6KqAH%2BLOq53crsXjxJX8UjAsS16aVul3Ur9DU3a84Xr2v586VIfQS4Jq6lvMLQmhd4LU%2FbIpuZmJY7%2Bl1VwdG0IeueQZSIJMDPcHXAE8ywXLj5CM2ZORsdRGoRuIXGnUEnlpyh7KPgeG28dHP6kRVbGRLUBXvc3EYRI4Y7ccg9p2lzTx4LFgsc7P6KW8SRSrP3ePZcEKKOhF7BPuoZQX9GO1EHFbwDrd9J8lnBOsnKMMaW21UCZj13Dd7hgX9K4Ygpu47mcmCq6PQ6pjnJeFp9zT1HhzQeqOOm9i%2BegeSUS3HXyrZRqrvL8RSoMCftJiJEk%2FMbK8ViWSyDw1uiPr%2F9ZM1o5ki66258%2BqKaJmkvxnUNkEQ8ngm7uwO71JWxNxqOdVSC14IEPZcet%2FPQQF4ewEr%2B8AdPMPY%2BZlRN8Y1BMUfuKouIG%2BHVfeyxUPNZlDqDGpo3VY2oR%2FXsWkEIMi49987IeRExExiwqwbDMMbN8NcGOqUBK217I3RepiV4EF5qeEVpEsyiszaWHuEi%2F%2BTYXAsOvqfvt7v8yLWfo9zO23OVgbTFt6SYtAwy6vRl0nmHz2mvbPn53J%2FMpHxESFOVljOU2eMVefnR4UlyM0acC0Lr%2FIEaP5peT0qgumr1jjCV1hjAnMkbVFJuU2PZIBuouVg3j4GlHCF30UYlqnw7OxzkkgE5m2xQRXE%2FmdHJ7iipBWJpaHISn8DX&X-Amz-Signature=e649ce46c932b2f27a7b647ed18901eaeae2f9345849bc4430bcc15311c00cc3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject](<https://prod-files-secure.s3.us-west-2.amazonaws.com/d8c9d738-5883-8170-a329-0003135dac6a/831c36f8-4219-4feb-8223-e736e92a3a39/%E7%AC%AC11%E9%A2%98-%E7%9B%B4%E5%BE%84%E4%B8%8E%E4%B8%AD%E5%BF%83.html?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664WN6R45U%2F20261117%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20261117T101105Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIQCA9iIwgqwH7olxohRMpDeWxhv60oK%2BkwcPzR28%2BG5%2FlAIgYWYR7wUuwIyv7SGrUyH0fxNA5QSDwoaMhds0pgH4TDQqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIrRIk76B5ACsDJzeSrcA2U8hBwD75NJfcw%2BJZLvS3vaZ7aNb5a%2F%2FaHoEfEUO3Y74N%2FB2CEaQZA0Cj%2FDPZB82IA6Au03yGR%2BNoTz3%2F9pLkKKiwkD3nMCZDkUFRjwcfX3mwHtMLiemXDOud35MBEPLUTsJvSynaidKzCJFbpT3M6KqAH%2BLOq53crsXjxJX8UjAsS16aVul3Ur9DU3a84Xr2v586VIfQS4Jq6lvMLQmhd4LU%2FbIpuZmJY7%2Bl1VwdG0IeueQZSIJMDPcHXAE8ywXLj5CM2ZORsdRGoRuIXGnUEnlpyh7KPgeG28dHP6kRVbGRLUBXvc3EYRI4Y7ccg9p2lzTx4LFgsc7P6KW8SRSrP3ePZcEKKOhF7BPuoZQX9GO1EHFbwDrd9J8lnBOsnKMMaW21UCZj13Dd7hgX9K4Ygpu47mcmCq6PQ6pjnJeFp9zT1HhzQeqOOm9i%2BegeSUS3HXyrZRqrvL8RSoMCftJiJEk%2FMbK8ViWSyDw1uiPr%2F9ZM1o5ki66258%2BqKaJmkvxnUNkEQ8ngm7uwO71JWxNxqOdVSC14IEPZcet%2FPQQF4ewEr%2B8AdPMPY%2BZlRN8Y1BMUfuKouIG%2BHVfeyxUPNZlDqDGpo3VY2oR%2FXsWkEIMi49987IeRExExiwqwbDMMbN8NcGOqUBK217I3RepiV4EF5qeEVpEsyiszaWHuEi%2F%2BTYXAsOvqfvt7v8yLWfo9zO23OVgbTFt6SYtAwy6vRl0nmHz2mvbPn53J%2FMpHxESFOVljOU2eMVefnR4UlyM0acC0Lr%2FIEaP5peT0qgumr1jjCV1hjAnMkbVFJuU2PZIBuouVg3j4GlHCF30UYlqnw7OxzkkgE5m2xQRXE%2FmdHJ7iipBWJpaHISn8DX&X-Amz-Signature=e649ce46c932b2f27a7b647ed18901eaeae2f9345849bc4430bcc15311c00cc3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject>)

**直径**：最远点对是 $d$ 与 $y$（或 $z$），最短路径

> d—b—c—e—u—v—x—y

共 **7 条边**，所以直径 = 7。

**中心**：各点偏心率

<table>
<tr><th>顶点</th><th>偏心率</th></tr>
<tr><td>e</td><td>4</td></tr>
<tr><td>u</td><td>4</td></tr>
<tr><td>c</td><td>5</td></tr>
<tr><td>h</td><td>5</td></tr>
<tr><td>v</td><td>5</td></tr>
<tr><td>f</td><td>5</td></tr>
</table>

$e$、$u$ 的偏心率都是 4，最小，所以中心 = $\{e, u\}$。

### 二、不定项选择题

1．关于图的度序列，下列命题正确的是（ ABCDE）

（A）同构的两个图的度序列相同；

> **解析：**同构意味着存在顶点间的一一对应，保持邻接关系。对应顶点的度数必然相同，所以两个图的度序列（作为多重集）完全一样。
> 知识点：度序列是同构不变量。
> 注意：反过来不成立——度序列相同，图不一定同构

（B）非负整数序列 $(d_{1}, d_{2}, \ldots, d_{n})$ 是图的度序列当且仅当 $d_{1}+d_{2}+\cdots+d_{n}$ 是偶数；

（C）非负整数序列 $(d_{1}, d_{2}, \ldots, d_{n})$ 是图的度序列当且仅当 $d_{1}, d_{2}, \ldots, d_{n}$ 中有偶数个奇数；

> 对于B选项由**定理** 非负整数组 $\left(d_{1}, d_{2}, \ldots, d_{n}\right)$ 是图的度序列的充分必要条件是：$\sum d_{i}$ 为偶数。证明可看第一章具体相关小节
> 
> 对于C选项由 **推论** 在任意图 $G$ 中，奇点的个数为偶数。

（D）如果正整数序列 $(d_{1}, d_{2}, \ldots, d_{n})$ 是一棵树的度序列且 $n \geq 2$，那么序列中至少有两个 1；

> 树有 n 个顶点、n−1 条边。取树的最长路径，它的两个端点都只连一条边，所以度数都是 1（叶子）。因此至少两个叶子。
> 知识点：**定理** 每棵非平凡树至少有两片树叶。

（E）存在一棵非平凡树以正整数序列 $(d_{1}, d_{2}, \ldots, d_{n})$ 为度序列当且仅当 $d_{1}+d_{2}+\cdots+d_{n}=2(n-1)$；

> 这是树度序列的充要条件：
> 正整数序列 (d₁, …, dₙ) 是某棵树的度序列 ⟺ d₁ + d₂ + ⋯ + dₙ = 2(n−1)。
> 
> - 必要性：树有 n−1 条边，握手定理。
> 
> - 充分性：可以用 Prüfer 序列或逐步构造法证明，任何满足该式的正整数序列都能造出一棵树。
> 知识点：树度序列定理（Prüfer 编码的推论）。

（F）若图 $G$ 的顶点度数之和大于等于图 $H$ 的顶点度数之和，则图 $G$ 度优于图 $H$；

> "度优于"（度序列优超，majorization）的定义比"总和"严格得多：
> 把两个度序列都降序排列，要求对每个 k，G 的前 k 大度数之和 ≥ H 的前 k 大度数之和（且总和相等）。
> 仅仅"总和 ≥"是必要条件，不是充分条件。

（G）如果非负整数序列 $(d_{1}, d_{2}, \ldots, d_{n})$ 是简单图的度序列，那么在同构意义下只能确定一个图。

> 知识点：度序列是必要不充分的同构不变量；同度序列可以有多个不同构的图。

2．对于序列（5，5，4，4，4，1，1），下列说法正确的是（ ABD）

（A）可能是简单图的度序列；

> 
> 
> $$
> \Pi=(5,5,4,4,4,1,1)\\
> \Rightarrow \Pi_1=(4,3,3,3,0,1)\\
> \Rightarrow \Pi_1=(4,3,3,3,1,0)\\
> \Rightarrow \Pi_2=(2,2,2,0,0)\\
> \Rightarrow \Pi_3=(1,1,0,0)\\
> 显然可以构造简单图
> $$

（B）可能是非简单图的度序列；

> 构造一个含重边的图即可。
> 取 7 个顶点$ v_1、v_2、…、v_7$：
> 
> 1. 让 $v_1、v_2、v_3、v_4、v_5$ 两两相连，构成完全图 K₅。此时这 5 个顶点的度都是 4。
> 
> 2. 再在$ v_1$和 $v_2$ 之间加一条边。这样它们之间有两条边，即出现重边；$v_1、v_2 $的度都变成 5。
> 
> 3. 连接$ v_6$和 $v_7$，使它们的度都为 1。
> 得到的图含有重边，因此是非简单图；各顶点的度依次为：
> (5, 5, 4, 4, 4, 1, 1)。
> 所以 B 正确。

（C）可能是森林的度序列；

> 对森林来说，$m=n-k，2m=\sum_i^nd(v_i)\Rightarrow2\times(7-k)=24$，显然不成立，所以不可能是森林的度序列。

（D）一定是包含圈的图的度序列；

> 若不含圈，则$G$就是森林，对对森林来说，$m=n-k，2m=\sum_i^nd(v_i)\Rightarrow2\times(7-k)=24$，显然不成立，所以不可能是森林的度序列。所以一定是包含圈的图的度序列。

（E）不是任意图的度序列。

> **定理** 非负整数组 $\left(d_{1}, d_{2}, \ldots, d_{n}\right)$ 是图的度序列的充分必要条件是：$\sum d_{i}$ 为偶数。$E$显然错误
> 
> 若“图”允许自环和重边，非负整数序列的度数和为偶数，确实足以构造出这样的图；自环按度数 2 计算。
> 若讨论简单图，度数和为偶数只是必要条件，不是充分条件。

3．下列说法错误的是（CE ）

（A）若一个图中存在闭途径，则一定存在圈；

> 闭途径是起点和终点相同、边不重复的非空途径。如果它中间没有重复顶点，本身就是圈；如果有重复顶点，可以截取其中一段更短的闭途径，最终得到一个圈。**正确**

（B）偶图中不存在奇圈；

> 偶图又称二分图，它的顶点可以分为两个集合，每条边的两个端点分别位于不同集合。
> 沿着图中的边走，每走一步就换到另一个集合；要回到出发点所在的集合，必须走偶数步。因此，偶图中不存在奇圈。**正确**

（C）若图 $G$ 不含三角形，则 $G$ 为偶图；


> **错误。 **“不含三角形”只能说明不存在长度为 3 的圈，不能排除长度为 5、7 等的奇圈。
> 反例是五边形对应的圈图 C₅：它没有三角形，却有长度为 5 的奇圈，所以不是偶图。

（D）图的顶点之间的连通关系一定是等价关系；


> **正确。**顶点之间的连通关系满足等价关系的三个条件：
> **自反性：**每个顶点与自身连通；
> **对称性**：若 u 与 v 连通，则 v 与 u 连通；
> **传递性**：若 u 与 v 连通，且 v 与 w 连通，则 u 与 w 连通。
> 这个等价关系划分出的各个等价类，正是图的各个连通分支。

（E）存在每个顶点的度数互不相同的非平凡简单图。

> **错误**。 设一个非平凡简单图有 n 个顶点，其中 n ≥ 2。每个顶点的度数只能取：
> 0, 1, 2, …, n−1
> 如果 n 个顶点的度数互不相同，就必须恰好取遍这 n 个值。但度数为 n − 1 的顶点与其余所有顶点相邻，因此图中不可能同时存在度数为 0 的顶点，产生矛盾。
> 所以，不存在每个顶点度数都互不相同的非平凡简单图。

4．关于简单图 $G$ 的邻接矩阵 $A$，下列说法错误的是（ ）

（A）矩阵 $A$ 的行和等于该行对应顶点的度数；

> 由邻接矩阵的定义得A显然正确

（B）矩阵 $A$ 的所有元素之和等于该图边数的 2 倍；


> 由邻接矩阵的定义得A显然正确

（C）矩阵 $A$ 的所有特征值之和等于该图边数的 2 倍；

（D）矩阵 $A$ 的所有特征值的平方和等于该图边数的 2 倍；

> 
> 
> $$
> \sum_i^n \lambda_i=0,\sum_i^n \lambda_i^2=2m\\
> \therefore C错误，D正确
> $$

（E）矩阵 $A^{2}$ 的主对角线上的元素之和等于该图边数的 2 倍；


> 对于矩阵 $A^{2}$，有$\sum_i^n a_{ii}^{(2)}=2m,$   $E$ 正确 

（F）若 $G$ 是非连通图，则 $A$ 相似于某个准对角矩阵。

> **（F）正确。**
> 
> 若图 $G$ 不连通，则 $G$ 至少有两个连通分支。将同一连通分支中的顶点排列在一起，重新编号后得到的邻接矩阵 $B$ 可写为分块对角矩阵：
> 
> $$
> B=\begin{pmatrix}
> A_1 & 0 & \cdots & 0\\
> 0 & A_2 & \cdots & 0\\
> \vdots & \vdots & \ddots & \vdots\\
> 0 & 0 & \cdots & A_k
> \end{pmatrix},\qquad k\geqslant 2,
> $$
> 
> 其中，$A_i$ 是第 $i$ 个连通分支的邻接矩阵。由于不同连通分支之间没有边，非对角块均为零矩阵。
> 
> 顶点重新编号对应于一个置换矩阵 $P$，因此
> 
> $$
> B=P^{-1}AP.
> $$
> 
> 故 $A$ 与分块对角矩阵 $B$ 相似，所以选项（F）正确。

5．下列说法正确的是（ ABC）

（A）若图 $G$ 无回路但任意添加一条边后有回路，则 $G$ 一定是树；

（B）若图 $G=(n, m)$ 连通且 $m=n-1$，则 $G$ 一定是树；

（C）若图 $G=(n, m)$ 无圈且 $m=n-1$，则 $G$ 一定是树；

> 
> 
> $$
> \begin{aligned}
> G \text{ 是树} &\iff G \text{ 无环且任意两点间存在唯一路} \\
> &\iff G \text{ 连通，删去任一边便不连通} \\
> &\iff G \text{ 连通，且 } m = n-1 \\
> &\iff G \text{ 无圈，且 } m = n-1 \\
> &\iff G \text{ 无圈，添加任一边可得唯一的圈}
> \end{aligned}\\
> 显然A、B、C均正确
> $$

（D）若图 $G$ 是一棵 2025 阶的树，则 $G$ 可能有三个中心点；

> **定理** 每棵树的中心由一个点或两个相邻点组成。D错误

（E）若图 $G$ 是一棵 2025 阶的树，则 $G$ 可能有两个形心点。

> 若$G$有两个形心点则，权均为$\frac{n}{2}$,而n=2025,不可能有小数权，显然$E$错误

### 三、解答题

1．设无向图 $G$ 有 10 条边，3 度与 4 度顶点各 2 个，其余顶点度数均小于 3，问 $G$ 中至少有几个顶点？在顶点数最少的情况下，写出 $G$ 的度序列，该度序列是一个图序列吗？

> 
> 
> $$
> 设度为2的顶点有x个，度为1的顶点为y个(x,y \in N) \\
> 由握手定理得：2m(G)=\sum_{i=1}^n {d(v_i)}\Rightarrow 20=4\times2+3\times2+2\times x+1\times y\\
> \Rightarrow 2x+y=6\\
> 由题意知f(x,y)=2+2+x+y需要最小，即求x+y的最小值\\
> \begin{cases}
> x,y\in N\\
> 2x+y=6\\
> \min{(x+y)}\\
> \end{cases}\\
> \Rightarrow x=3,y=0\\
> 此时，顶点数最少的度序列\Pi={\{4,4,3,3,2,2,2\}}\\
> \Pi_1=\{3,2,2,1,2,2\}=\{3,2,2,2,2,1\}\\
> \Pi_2=\{2,1,1,1,1\}\\
> \Pi_3=\{1,1,0,0\}显然能构成简单图，所以该序列是图序列。
> $$

2．证明：若 $G$ 是简单图且 $\delta(G) \geq 2$，则 $G$ 包含长度至少是 $\delta(G)+1$ 的圈。

> 证明：设$W=v_{1}v_{2}v_{3}....v_{k-1}v_{k}$是$G$中的一条最长路
> 
> $\because \delta(G) \geq 2,\therefore v_{1}$必然有相异于$v_{2}$的相邻顶点
> 
> 取$m=\max\{i:\ v_{1}v_{i}\in E(G)\},
> $
> 
> 即 $v_m$ 是 $v_1$在路$ W $上**下标最大的邻点**。于是，$v_1 $的所有邻点都属于集合$
> \{v_2,v_3,\ldots,v_m\}.
> $
> 
> $\because$ 该集合有 $m-1$ 个顶点，$\therefore \delta(G)\leq d(v_1)\leq m-1$，$\therefore m\geq\delta(G)+1$。
> 
> 由于$ v_1v_m\in E(G)$，路段 $v_1v_2\cdots v_m$ 加上边 $v_mv_1$，便构成圈
> $
> C=v_1v_2\cdots v_mv_1.
> $
> 
> $\therefore \
> |E(C)|=m\ge \delta(G)+1.
> $
> 
> 因此，$G$中必然包含长度至少为$ \delta(G)+1$的圈。证毕。

3．设 $G$ 为具有 $n$ 个点、$m$ 条边的简单图，若 $m>n-1$，则 $G$ 一定包含圈。

> 
> 
> $$
> 假设G无圈， \therefore G是森林且可设有k条分支(k\ge2)\\
>  \therefore m=n-k<n-1与假设矛盾\\
> \therefore m>n-1时，G一定包含圈
> $$

4．证明：若 $k$ 正则连通图 $G$ 中每个圈的长度至少为 4，则 $G$ 至少包含 $2k$ 个顶点

> 
> 
> $$
> 当k=0时，显然成立\\
> 当k\ge1时，取任意一条边uv。\\
> \because G是k正则连通图。\therefore d(u)=d(v)=k。\\
> u的邻接点集合N(u)，有k个点
> v的邻接点集合N(v)，有k个点。\\
> 两个集合且没有公共集合。\\
> 若存在点w与u,v都邻接，则存在长度为3的圈，与提议不符。\\
> \therefore |V(G)|\ge |N(v)|+|N(u)|=2k
> $$

5．证明：若图 $G$ 的直径大于 3，则图 $G$ 的补图的直径小于 3。

> 证明：
> 设 $\overline{G}$ 为图 $G$ 的补图。任取两个不同的顶点 $u,v\in V(G)$。
> 若 $uv\in E(\overline{G})$，则
> 
> $$
> d_{\overline{G}}(u,v)=1.
> $$
> 
> 若 $uv\notin E(\overline{G})$，则 $uv\in E(G)$。下面需证明存在顶点 $w$，使得 $uw,vw\in E(\overline{G})$。
> 假设不存在这样的顶点 $w$，则对于任意 $w\in V(G)\setminus\{u,v\}$，至少有 $uw\in E(G)$ 或 $vw\in E(G)$。因此，图 $G$ 中每个顶点到集合 $\{u,v\}$ 的距离至多为 $1$。
> 又由于 $uv\in E(G)$，任取 $x,y\in V(G)$，均有
> 
> $$
> d_G(x,y)\leqslant 1+1+1=3.
> $$
> 
> 于是 $\operatorname{diam}(G)\leqslant 3$，与题设矛盾。
> 故存在顶点 $w$，使得 $uw,vw\in E(\overline{G})$，从而
> 
> $$
> d_{\overline{G}}(u,v)\leqslant 2.
> $$
> 
> 综上，$\overline{G}$ 中任意两个不同顶点的距离均不超过 $2$，因此 $\overline{G}$ 连通，且
> 
> $$
> \operatorname{diam}(\overline{G})\leqslant 2<3.
> $$
> 
> 证毕。

6．在某种无环状结构（至少三个原子形成环）的碳氢化合物 $C_{m}H_{n}$ 中，每个碳原子 $(C)$ 处有 4 条化学键，每个氢原子 $(H)$ 处有 1 条化学键。已知该分子中恰有两个碳原子之间是以三键相连，其余碳原子之间以单键相连。当 $m=20$ 时，试求 $n$ 的值。（用图论方法求解并说明具体理由）

> 由题可知，可以将碳氢化合物 $C_{m}H_{n}$ 的结构看出图$G$，每个原子看成一个顶点，一条化学键看作成一条边。
> 
> 由于每个碳原子$C$有四条化学键，每个氢原子$H$有一条化学键，则每个碳原子的度为4，每个氢原子的度为1。所以可得$\sum_{i=1}^{m+n}d(v_i)=4m+n$。
> 
> 又已知该分子中恰有两个碳原子之间是以三键相连，其余碳原子之间以单键相连。
> 
> 可求得$m(G)=n+m+1$
> 
> 
> $$
> \begin{cases}
> m=20\\
> 2m(G)=\sum_{i=1}^{m+n}d(v_i)\\
> m(G)=n+m+1\\
> \sum_{i=1}^{n+m}d(v_i)=4m+n
> \end{cases}\\
> 解得：n=38
> $$

7．某市有 7 个化工厂，它们之间的公路及距离如图所示。拟修建一个消防站来负责这些工厂的安全工作，问消防站应设在哪个工厂，以便发生灾情时能够及时赶去处理？

![](assets/graph-homework-1-40a9d738588381828a70f05c8c225c4f.jpg)

> 这道题要找的是图的中心：把消防站设在某个工厂后，考虑它到其他工厂的最短距离，让其中最大的距离尽可能小。这样选址的意思是：即使火灾发生在离消防站最远的工厂，赶过去所需的路程也尽量短。
> 
> $$
> e(a)=d(a,u)=9.3,e(b)=d(b,u)=6.3,e(c)=d(c,u)=d(c,a)=5,\\
> e(u)=d(u,a)=9.3,e(v)=d(v,a)=6.3,e(w)=d(w,a)=4.8,\\e(x)=d(x,u)=6.3\\
> r(G)=\min\{e(v)|v\in V(G)\}=e(w)=4.8\\
> \therefore w是中心，消防站应该设在w工厂
> $$


